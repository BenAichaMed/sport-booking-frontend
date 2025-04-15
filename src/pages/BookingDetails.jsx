import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
// import { loadStripe } from '@stripe/stripe-js';
import Loader from "../components/Loader";
import PaymentModal from "../components/PaymentModal";
import ConfirmationModal from "../components/ConfirmationModal";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(
          `http://localhost:5000/api/bookings/${bookingId}`,
          headers
        );
        const bookingData = res.data;

        // Check if the booking hour has passed
        const bookingDate = new Date(bookingData.date);
        const [startHour] = bookingData.timeSlot
          .split("-")[0]
          .split(":")
          .map(Number);

        const now = new Date();
        const currentHour = now.getHours();

        if (
          now.toDateString() === bookingDate.toDateString() && // Ensure it's the same day
          currentHour >= startHour && // Check if the current hour has passed or is the same
          bookingData.paymentStatus !== "onsite"
        ) {
          // Update payment status to "onsite"
          await axios.post(
            `http://localhost:5000/api/bookings/${bookingId}/mark-onsite`,
            {},
            headers
          );

          // Refresh booking data
          const updatedBooking = await axios.get(
            `http://localhost:5000/api/bookings/${bookingId}`,
            headers
          );
          setBooking(updatedBooking.data);
        } else {
          setBooking(bookingData);
        }
      } catch (error) {
        setError("Error fetching booking details. Please try again later.");
        console.error("Error fetching booking details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handlePaymentMethodSelect = async (method) => {
    setIsPaymentModalOpen(false);
    setError(null);

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      if (method === "online") {
        try {
          await axios.post(
            `http://localhost:5000/api/bookings/${bookingId}/mark-paid`,
            {},
            headers
          );

          // Refresh booking data
          const updatedBooking = await axios.get(
            `http://localhost:5000/api/bookings/${bookingId}`,
            headers
          );
          setBooking(updatedBooking.data);
        } catch (error) {
          console.error("Error marking as paid:", error);
          throw error;
        }
      } else if (method === "onsite") {
        // Mark as onsite payment
        await axios.post(
          `http://localhost:5000/api/bookings/${bookingId}/mark-onsite`,
          {},
          headers
        );

        // Refresh booking data
        const updatedBooking = await axios.get(
          `http://localhost:5000/api/bookings/${bookingId}`,
          headers
        );
        setBooking(updatedBooking.data);
      }
    } catch (error) {
      setError("Payment processing failed. Please try again.");
      console.error("Payment error:", error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      await axios.post(
        `http://localhost:5000/api/bookings/cancel`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/mybookings");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">Booking not found.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const now = new Date();
  const bookingDate = new Date(booking.date);
  const s = 3;

  const [startHour, startMinute] = booking.timeSlot
    .split("-")[0]
    .split(":")
    .map(Number);

  const timeSlotStart = new Date(bookingDate);
  timeSlotStart.setHours(startHour, startMinute, 0, 0);

  const canBeCancelled =
    booking.status === "pending" &&
    timeSlotStart > new Date(now.getTime() + s * 60 * 60 * 1000);

  const requiresPayment =
    booking.paymentStatus === "pending" && booking.status !== "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to My Bookings
          </button>

          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Booking Details
            </h1>
            <div className="flex gap-3">
              {requiresPayment && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Pay Now
                </button>
              )}
              {canBeCancelled && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {booking.courtId.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                  booking.paymentStatus
                )}`}
              >
                {booking.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{booking.timeSlot}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{booking.courtId.location}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Tag className="w-5 h-5 mr-3 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">
                    ${booking.courtId.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Court Details
              </h3>
              <p className="text-gray-600">{booking.courtId.description}</p>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        amount={booking.courtId.price}
      />

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        type="danger"
      />
    </div>
  );
};

export default BookingDetails;
