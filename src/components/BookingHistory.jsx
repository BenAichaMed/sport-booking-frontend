import { useState, useEffect, use } from "react";
import axios from "axios";
import Loader from "./Loader";
import { format } from "date-fns";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

 
  

  useEffect(() => {
    const userBookings = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));

        const res = await axios.get("http://localhost:5000/api/bookings/", { 
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
         });
        setBookings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    userBookings();
  }, [bookings]);


  const cancelBooking = async (bookingId) => {
    try {
        const token = JSON.parse(localStorage.getItem("token"));

      await axios.post(`http://localhost:5000/api/bookings/cancel`,
       { bookingId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
        }
        
    );

      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)));
    } catch (error) {
      console.log(error);
    }
  };


  if(!bookings){
    <div><Loader/></div>
  }


  return (
    <div className="space-y-4 h-96 overflow-y-auto">
      {bookings.map((booking) => (
        <div key={booking._id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold">{booking.courtId.name}</h3>
          <p className="text-sm text-gray-600">
          {format(new Date(booking.date), "yyyy-MM-dd")} <span className="font-bold">{format(new Date(booking.date), "EEEE")}</span>  at {booking.timeSlot}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <span
              className={`text-sm font-medium ${
                booking.status === "pending"
                  ? "text-yellow-600"
                  : booking.status === "confirmed"
                  ? "text-green-600"
                  : booking.status === "cancelled"  
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            {booking.status === "pending" && (
              <button
                onClick={() => cancelBooking(booking._id)}
                className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;