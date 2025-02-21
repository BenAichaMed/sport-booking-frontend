import React, {useState,useEffect} from 'react'

import {MapPin,Calendar} from "lucide-react"
import axios from 'axios';

export const ListCourts = () => {

      const [courts, setCourts] = useState([]);
      const [searched, setSearched] = useState({location:"",date:"",type:"" })
      console.log(searched)
    

    useEffect(() => {
        const fetchCourts = async () => {
          try {
            const res = await axios.get("http://localhost:5000/api/courts/list");
            setCourts(res.data.courts); 
          } catch (error) {
            console.error("Error fetching courts:", error);
          }
        };
        fetchCourts();
      }, []);

      const handleChange = (e) => {
        setSearched({ ...searched, [e.target.name]: e.target.value });
      };


  return (
    <div className="min-h-screen bg-white">
    <div className="max-w-4xl mx-auto mt-16 px-4">
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center border rounded-lg p-3">
          <MapPin className="text-gray-400 mr-2" />
          <input name='location' value={searched.location} onChange={handleChange} type="text" placeholder="Location" className="w-full focus:outline-none" />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="text-gray-400 mr-2" />
          <input name='date' type="date" value={searched.date} onChange={handleChange} className="w-full focus:outline-none" />
        </div>
        <div>
            <select
              name="type"
              value={searched.type}
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
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Search Courts
        </button>
      </div>
    </div>
  </div>
  
      {/* Available Courts i think i will change this based on nearest courts and with user preferences but for now i will keep it like this  */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Available Courts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courts.map((court) => (
              
              <div 
                key={court._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => navigate("/courts/"+court._id)}
              >
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{court.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {court.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{court.type}</span>
                    <span className="font-semibold text-blue-600">${court.price}/hour</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  </div>
  )
}

export default ListCourts;
