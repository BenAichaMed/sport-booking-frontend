import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, DollarSign, MapPin, Phone, Shield, User, Star, Trash } from 'lucide-react';
import Loader from "../components/Loader";
import { Trash2 } from 'lucide-react';

const EditCourt = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    contact: '',
    description: '',
    amenities: [],
    unavailableDays: [], // Changed from availability to unavailableDays
  });

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courts/${courtId}`);
        setCourt(res.data.court);
        setFormData({
          name: res.data.court.name,
          location: res.data.court.location,
          price: res.data.court.price,
          contact: res.data.court.contact,
          description: res.data.court.description,
          amenities: res.data.court.amenities,
          unavailableDays: res.data.court.unavailableDays || [], // Updated to unavailableDays
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourt();
  }, [courtId]);

  if (!court) {
    return <div><Loader /></div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenitiesChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData({ ...formData, amenities: newAmenities });
  };

  const handleUnavailableDaysChange = (index, field, value) => {
    const newUnavailableDays = [...formData.unavailableDays];
    newUnavailableDays[index][field] = value;
    setFormData({ ...formData, unavailableDays: newUnavailableDays });
  };

  const handleAddAmenity = () => {
    setFormData({ ...formData, amenities: [...formData.amenities, ''] });
  };

  const handleAddUnavailableDay = () => {
    setFormData({ ...formData, unavailableDays: [...formData.unavailableDays, { date: '', reason: '' }] });
  };

  const handleRemoveUnavailableDay = (index) => {
    const newUnavailableDays = [...formData.unavailableDays];
    newUnavailableDays.splice(index, 1);
    setFormData({ ...formData, unavailableDays: newUnavailableDays });
  };

  const handleSave = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await axios.put(`http://localhost:5000/api/courts/edit/${courtId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate(`/courts/${courtId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-[400px]">
            <img
              src={court.image}
              alt={court.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-4xl font-bold text-white mb-2">Edit Court</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows="4"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                {formData.amenities.map((amenity, index) => (
                  <input
                    key={index}
                    type="text"
                    value={amenity}
                    onChange={(e) => handleAmenitiesChange(index, e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-2"
                  />
                ))}
                <button
                  onClick={handleAddAmenity}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Add Amenity
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Unavailable Days</label>
                {formData.unavailableDays.map((unavailableDay, index) => (
                  <div key={index} className="mb-4">
                    <input
                      type="date"
                      value={unavailableDay.date}
                      onChange={(e) => handleUnavailableDaysChange(index, 'date', e.target.value)}
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-2"
                    />
                    <input
                      type="text"
                      value={unavailableDay.reason}
                      onChange={(e) => handleUnavailableDaysChange(index, 'reason', e.target.value)}
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Reason for unavailability"
                    />
                    <button
                      onClick={() => handleRemoveUnavailableDay(index)}
                      className="mt-2"
                      color="secondary"
                    >
                      
                      <Trash2 size={20} color="red" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddUnavailableDay}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Add Unavailable Day
                </button>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourt;