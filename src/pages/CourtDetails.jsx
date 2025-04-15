import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Loader from "../components/Loader";
import { TextField, Button } from "@mui/material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

const CourtDetails = () => {
  const { courtId } = useParams();
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [booked, setBooked] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourtDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courts/${courtId}`
        );
        setCourt(res.data.court);

        const reviewsRes = await axios.get(
          `http://localhost:5000/api/reviews/${courtId}`
        );
        setReviews(reviewsRes.data.reviews);
        setAverageRating(reviewsRes.data.averageRating);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourtDetails();
  }, [courtId, booked, averageRating]);

  const handleReviewSubmit = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("Please log in to add a review.");
      return;
    }

    if (!newReview.trim() || rating === 0) {
      alert("Please provide a review and rating.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews/add",
        {
          courtId,
          rating,
          comment: newReview,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReviews((prevReviews) => [...(prevReviews || []), res.data.review]);
      setNewReview("");
      setRating(0);
    } catch (error) {
      console.error(
        "Error adding review:",
        error.response?.data || error.message
      );
      alert("Failed to add review. Try again.");
    }
  };

  if (loading || !court) {
    return <Loader />;
  }

  const today = dayjs().startOf("day");
  const availableDates =
    court.availability
      ?.map((a) => dayjs(a.date))
      .filter((date) => date.isSameOrAfter(today)) || [];

  const selectedDateSlots =
    court.availability
      ?.find((a) => dayjs(a.date).isSame(selectedDate, "day"))
      ?.timeSlots.filter((time) => {
        if (dayjs(selectedDate).isSame(dayjs(), "day")) {
          const [hours] = time.split(":").map(Number);
          const currentHour = dayjs().hour();
          return hours > currentHour;
        }
        return true;
      }) || [];

  // const selectedDateSlots = court.availability ?.find((a) => dayjs(a.date).isSame(selectedDate, 'day'))?.timeSlots || [];

  const shouldDisableDate = (date) => {
    return !availableDates.some((availableDate) =>
      date.isSame(availableDate, "day")
    );
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      alert("Please select a time slot");
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("Please log in to book");
      return;
    }

    const bookingDetails = {
      courtId,
      date: selectedDate.format("YYYY-MM-DD"),
      timeSlot: selectedTime,
    };

    try {
      await axios.post(
        `http://localhost:5000/api/bookings/create`,
        bookingDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBooked(true);
      navigate("/mybookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Court Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-[400px]">
            <img
              src={court.image}
              alt={court.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
                <span className="text-white ml-2">{averageRating}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {court.name}
              </h1>
              <div className="flex items-center text-white gap-4 flex-wrap">
                <span className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {court.location}
                </span>
                <span className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {court.price}/hour
                </span>
                <span className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  {court.contact}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Select Date
                </h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleSelectDate}
                    shouldDisableDate={shouldDisableDate}
                    format="DD/MM/YYYY"
                    slots={{
                      textField: (params) => (
                        <TextField {...params} fullWidth />
                      ),
                    }}
                  />
                </LocalizationProvider>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Select Time
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDateSlots.length === 0 && (
                    <div className="col-span-3 text-center text-gray-500">
                      No available time for this date.
                    </div>
                  )}
                  {selectedDateSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        selectedTime === time
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Summary and Action */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  {selectedDate && selectedTime && (
                    <div className="text-lg">
                      Selected:{" "}
                      <span className="font-semibold">
                        {selectedDate.format("MMMM D")} at {selectedTime}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleBooking}
                  variant="contained"
                  color="success"
                  className="font-bold py-3 px-8 rounded-lg transition duration-300"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Court Details and Reviews */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Description and Amenities */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">About this Court</h2>
              <p className="text-gray-600 mb-6">{court.description}</p>

              <h3 className="font-semibold text-lg mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {court.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>

              {/* Display Existing Reviews */}
              <div className="space-y-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b last:border-b-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold">
                            {review.userId.name || "Anonymous"}
                          </h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                } fill-current`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No reviews yet.</p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                <textarea
                  className="w-full border rounded-lg p-3 mb-4"
                  placeholder="Write your review here..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                />
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 cursor-pointer ${
                        i < rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400"
                      }`}
                      onClick={() => setRating(i + 1)}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleReviewSubmit}
                  variant="contained"
                  color="primary"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>

          {/* Contact and Additional Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                <span>{court.contact}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span>{court.location}</span>
              </div>
              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold mb-2">Court Type</h3>
                <p className="text-gray-600">{court.type}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Price</h3>
                <p className="text-gray-600">${court.price} per hour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetails;
