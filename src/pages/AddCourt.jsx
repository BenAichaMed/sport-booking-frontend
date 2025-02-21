import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCourt = () => {
  const [form, setForm] = useState({
    name: "",
    type: "Tennis",
    location: "",
    price: "",
    image: "",
    description: "",
    contact: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/courts", form);
      navigate("/");
    } catch (error) {
      console.error("Error adding court:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Add New Court</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="Tennis">Tennis</option>
              <option value="Padel">Padel</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200"
          >
            Add Court
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourt;