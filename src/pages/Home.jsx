import React,{ useState, useEffect,  } from 'react';
import {
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  Clock,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Home() {

  const [courts, setCourts] = useState([]); 

  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-5xl font-bold mb-6">Book Your Perfect Court</h1>
          <p className="text-xl mb-8">Tennis • Football • Basketball • Padel</p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Book Your Court Now
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto mt-16 px-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center border rounded-lg p-3">
              <MapPin className="text-gray-400 mr-2" />
              <input type="text" placeholder="Location" className="w-full focus:outline-none" />
            </div>
            <div className="flex items-center border rounded-lg p-3">
              <Calendar className="text-gray-400 mr-2" />
              <input type="date" className="w-full focus:outline-none" />
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


      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Clock className="text-blue-600 w-8 h-8" />, title: "Easy Booking", desc: "Book your court in seconds with our simple booking system" },
              { icon: <CreditCard className="text-green-600 w-8 h-8" />, title: "Secure Payments", desc: "Safe and secure payment processing for peace of mind" },
              { icon: <Shield className="text-purple-600 w-8 h-8" />, title: "Verified Courts", desc: "All courts are verified and maintained to high standards" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CourtBooker</h3>
              <p className="text-gray-400">Book your perfect sports court with ease.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <p className="flex items-center text-gray-400"><Mail className="w-4 h-4 mr-2" /> contact@courtbooker.com</p>
                <p className="flex items-center text-gray-400"><Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><Facebook className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Twitter className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Instagram className="w-6 h-6" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CourtBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;



