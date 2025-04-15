import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart,
  Activity,
  Star,
  AlertCircle
} from 'lucide-react';
import AddUserPopup from '../../components/AddUser';

const mockBookings = [
  {
    id: '1',
    courtName: 'Central Tennis Court',
    userName: 'John Doe',
    date: '2024-03-10',
    time: '10:00 AM',
    status: 'confirmed'
  },
  {
    id: '2',
    courtName: 'Downtown Basketball Court',
    userName: 'Jane Smith',
    date: '2024-03-12',
    time: '2:00 PM',
    status: 'cancelled'
  }
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [courts, setCourts] = useState([]);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courts/list`);
        setCourts(res.data.courts);
        console.log(res.data.courts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourt();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/getUsers`);
        setUsers(res.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
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
          <button
            onClick={() => setActiveTab('courts')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'courts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Courts
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="space-y-8">
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Users</h2>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowAddUserPopup(true)}
              >
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'owner'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Bookings</h2>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Booking ID</th>
                    <th className="text-left py-3 px-4">Court</th>
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="py-3 px-4">{booking.id}</td>
                      <td className="py-3 px-4">{booking.courtName}</td>
                      <td className="py-3 px-4">{booking.userName}</td>
                      <td className="py-3 px-4">{booking.date}</td>
                      <td className="py-3 px-4">{booking.time}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
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
        )}

        {activeTab === 'courts' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Courts</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Court Owner
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Court Name</th>
                    <th className="text-left py-3 px-4">Owner</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Contact</th>

                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courts.map((court) => (
                    <tr key={court._id} className="border-b">
                      <td className="py-3 px-4">{court.name}</td>
                      <td className="py-3 px-4">{court.ownerId.name}</td>
                      <td className="py-3 px-4">{court.location}</td>
                      <td className="py-3 px-4">{court.contact}</td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          court.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {court.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddUserPopup && (
        <AddUserPopup
          onClose={() => setShowAddUserPopup(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  );
}

export default AdminDashboard;