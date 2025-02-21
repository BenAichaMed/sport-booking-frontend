import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, MapPin,Star,Phone,Shield,User } from 'lucide-react';
import Loader from "../components/Loader";

const CourtDetails = () => {
  const { courtId } = useParams();
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courts/${courtId}`);
        setCourt(res.data.court);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourt();
  }, [courtId]);

  if (!court) {
    return <div><Loader/></div>;
  }

  const availableDates = court.availability?.map(a => a.date) || [];
  const selectedDateSlots = court.availability?.find(a => a.date === selectedDate)?.timeSlots || [];

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime}`);
  };
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    
  }


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
                    className={`w-5 h-5 ${i < Math.floor(court.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                  />
                ))}
                <span className="text-white ml-2">{court.rating.toFixed(1)}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{court.name}</h1>
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
                <div className="grid grid-cols-3 gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => handleSelectDate(date)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        selectedDate === date
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-semibold">{format(new Date(date), 'MMM d')}</div>
                      <div className="text-sm">{format(new Date(date), 'EEEE')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Select Time
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDateSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
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
                      Selected: <span className="font-semibold">{format(new Date(selectedDate), 'MMMM d')} at {selectedTime}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                >
                  Book Now
                </button>
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
                {court.amenties.map((amenity, index) => (
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
              <div className="space-y-6">
                {court.reviews.map((review, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold">{review.user}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                ))}
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