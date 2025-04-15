import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Clock,
  Plus,
  Minus,
  Save,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

function AddCourt() {
  const navigate = useNavigate();
  const [court, setCourt] = useState({
    name: '',
    type: 'Tennis',
    location: '',
    price: 0,
    description: '',
    image: '',
    amenities: [],
    contact: '',
    availability: [{ date: '', timeSlots: [] }]
  });

  const [newAmenity, setNewAmenity] = useState('');
  // const [timeSlot, setTimeSlot] = useState('09:00');
  const [imagePreview, setImagePreview] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourt(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sport_booking_app");
    formData.append("cloud_name", "g4d");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/g4d/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCourt((prev) => ({ ...prev, image: data.secure_url }));
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };
  
  

  const handleAddAmenity = () => {
    if (newAmenity && !court.amenities.includes(newAmenity)) {
      setCourt(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setCourt(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleAddTimeSlot = (date) => {
    if (!timeSlot) return;

    setCourt(prev => ({
      ...prev,
      availability: prev.availability.map(a => {
        if (a.date === date && !a.timeSlots.includes(timeSlot)) {
          return {
            ...a,
            timeSlots: [...a.timeSlots, timeSlot].sort()
          };
        }
        return a;
      })
    }));
  };

  const handleRemoveTimeSlot = (date, slot) => {
    setCourt(prev => ({
      ...prev,
      availability: prev.availability.map(a => {
        if (a.date === date) {
          return {
            ...a,
            timeSlots: a.timeSlots.filter(t => t !== slot)
          };
        }
        return a;
      })
    }));
  };

  const handleAddDate = () => {
    setCourt(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        { date: '', timeSlots: [] }
      ]
    }));
  };

  const handleRemoveDate = (index) => {
    setCourt(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleDateChange = (index, date) => {
    setCourt(prev => ({
      ...prev,
      availability: prev.availability.map((a, i) => {
        if (i === index) {
          return { ...a, date };
        }
        return a;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.post(`http://localhost:5000/api/courts/add`, court, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate('/owner');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/owner')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-center">Add New Court</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Court Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={court.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={court.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Tennis">Tennis</option>
                <option value="Padel">Padel</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={court.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price per Hour
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={court.price}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>
          </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={court.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>

            <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" /> Upload Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Choose File
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="ml-4 w-24 h-24 object-cover rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>


          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={court.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                placeholder="Add amenity..."
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {court.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(amenity)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Availability
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 inline mr-1" />
                Availability
              </label>
              <button
                type="button"
                onClick={handleAddDate}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Date
              </button>
            </div>
            
            {court.availability.map((availability, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="date"
                    value={availability.date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="time"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTimeSlot(availability.date)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availability.timeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-3 py-1 bg-white rounded-full flex items-center gap-2"
                    >
                      {slot}
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(availability.date, slot)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div> */}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Add Court
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourt;