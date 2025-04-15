import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash,
  Clock
} from 'lucide-react';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [todaysinfo, setTodaysinfo] = useState({
    bookings: [],
    revenue: 0,
    utilizationRate: 0,
  });
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [courtToDelete, setCourtToDelete] = useState({ id: null, name: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const todaysInfo = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));

        const res = await axios.get("http://localhost:5000/api/bookings/today", { 
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
         });
        setTodaysinfo(res.data);
      } catch (error) {
        console.log(error);
      }
    };  
    todaysInfo();
  }, []);

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
  }, []);

  useEffect(() => {
    const myCourts = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));

        const res = await axios.get("http://localhost:5000/api/courts/mycourts", { 
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
         });
        setCourts(res.data.courts);
      } catch (error) {
        console.log(error);
      }
    };
    myCourts();
  }, []);

  const confirmBooking = async (bookingId) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.post(`http://localhost:5000/api/bookings/accept`, { bookingId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "confirmed" } : booking)));
    } catch (error) {
      console.log(error);
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.post(`http://localhost:5000/api/bookings/reject`, { bookingId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCourt = (courtId, courtName) => {
    setCourtToDelete({ id: courtId, name: courtName });
    setShowDeletePopup(true);
  };

  const confirmDeleteCourt = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(`http://localhost:5000/api/courts/delete/${courtToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCourts(courts.filter((court) => court._id !== courtToDelete.id));
      setShowDeletePopup(false);
      setCourtToDelete({ id: null, name: '' });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelDeleteCourt = () => {
    setShowDeletePopup(false);
    setCourtToDelete(null);
  };

  if (!courts) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Top Stats */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-lg">Today's Bookings</p>
                <h3 className="text-3xl font-bold">{todaysinfo.bookedSlots}</h3>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-6 flex items-center text-green-500">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="text-lg">+2 from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-lg">Today's Revenue</p>
                <h3 className="text-3xl font-bold">${todaysinfo.revenue}</h3>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="mt-6 flex items-center text-green-500">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="text-lg">+$50 from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-lg">Utilization Rate</p>
                <h3 className="text-3xl font-bold">{todaysinfo.utilizationRate}%</h3>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courts')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'courts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Courts
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'bookings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bookings
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Court</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id} className="border-b">
                        <td className="py-3 px-4">{booking.courtId.name}</td>
                        <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{booking.timeSlot}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Chart */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder
                    </div>
                  </div>
                  </>
                )}

                {activeTab === 'courts' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">My Courts</h2>
                    <button onClick={()=>navigate('/courts/add')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Court
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courts.map((court) => (
                    <div key={court._id} className="bg-gray-50 rounded-lg p-4">
                      <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-lg mb-2">{court.name}</h3>
                      <p className="text-gray-600 mb-4">{court.location}</p>
                      <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">${court.price}/hr</span>
                      <div className="flex gap-2">
                        <button onClick={() => navigate('/edit/'+court._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCourt(court._id, court.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash className="w-4 h-4" />
                        </button>
                      </div>
                      </div>
                    </div>
                    ))}
                  </div>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">All Bookings</h2>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Export
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                      <th className="text-left py-3 px-4">Court</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                      <tr key={booking._id} className="border-b">
                        <td className="py-3 px-4">
                        {booking.courtId.name}
                        </td>
                        <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{booking.timeSlot}</td>
                        <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                        </td>
                        <td className="py-3 px-4">
                        {booking.status === 'pending' && (
                          <>
                          <button
                            onClick={() => confirmBooking(booking._id)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => rejectBooking(booking._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                          </>
                        )}
                        </td>
                      </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                  </div>
                )}
                </div>

                {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete <strong>{courtToDelete.name}</strong> court?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDeleteCourt}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCourt}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;