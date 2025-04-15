import React,{ useState, useEffect,  } from 'react';
import { Calendar, MapPin, Clock, ChevronRight, ChevronLeft, Tent as Tennis, ShoppingBasket as Basketball, FolderRoot as Football, Users,Mail,Phone,Facebook,Twitter,Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function Home() {

  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate()

  const slides = [
    {
      image: "/tennis.jpg",
      title: "Book Your Tennis Court",
      description: "Experience world-class tennis courts with professional-grade surfaces"
    },
    {
      image: "basketball.jpg",
      title: "Basketball Courts Available",
      description: "Indoor and outdoor courts perfect for your game"
    },
    {
      image: "football.jpg",
      title: "Book Football Fields",
      description: "Well-maintained fields for 5-a-side or full team matches"
    },
    {
      image: "padel.jpg",
      title: "Padel Courts Ready",
      description: "State-of-the-art padel courts with professional facilities"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };


  return (
    <div className="min-h-screen bg-white">
        {/* Hero Section with Slider */}
        <div className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`text-white max-w-2xl transition-opacity duration-1000 absolute ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <h1 className="text-5xl font-bold mb-6">{slide.title}</h1>
              <p className="text-xl mb-8">{slide.description}</p>
              <button onClick={() => navigate('/courts/list')}  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2">
                Book Now <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white scale-100' : 'bg-white/50 scale-75'
                }`}
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Calendar className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
              <p className="text-gray-600">Book your preferred court in seconds with our intuitive booking system.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <MapPin className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Multiple Locations</h3>
              <p className="text-gray-600">Find courts near you with our wide network of sporting facilities.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
              <p className="text-gray-600">Book anytime, day or night, and manage your reservations easily.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Sections */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tennis Section */}
          <div id="tennis" className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="flex-1">
              <Tennis className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Tennis Courts</h2>
              <p className="text-gray-600 mb-6">Experience premium tennis courts with professional-grade surfaces. Perfect for both casual players and serious athletes.</p>
              <button onClick={() => navigate('/courts/list')}  className="text-green-600 font-semibold flex items-center gap-2">
                Book Your Court <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <img 
                src="tennis.jpg"
                alt="Tennis player"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Basketball Section */}
          <div id="basketball" className="flex flex-col md:flex-row-reverse items-center gap-12 mb-20">
            <div className="flex-1">
              <Basketball className="w-12 h-12 text-orange-600 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Basketball Courts</h2>
              <p className="text-gray-600 mb-6">Indoor and outdoor courts available with professional hoops and perfect lighting for your game.</p>
              <button onClick={() => navigate('/courts/list')}  className="text-orange-600 font-semibold flex items-center gap-2">
                Book Your Court <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <img 
                src="basketball.jpg"
                alt="Basketball court"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Football Section */}
          <div id="football" className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="flex-1">
              <Football className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Football Fields</h2>
              <p className="text-gray-600 mb-6">Well-maintained grass and turf fields perfect for 5-a-side or full team matches.</p>
              <button onClick={() => navigate('/courts/list')}  className="text-blue-600 font-semibold flex items-center gap-2">
                Book Your Field <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <img 
                src="football.jpg"
                alt="Football field"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Padel Section */}
          <div id="padel" className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Padel Courts</h2>
              <p className="text-gray-600 mb-6">State-of-the-art padel courts with professional glass walls and perfect lighting.</p>
              <button onClick={() => navigate('/courts/list')} className="text-purple-600 font-semibold flex items-center gap-2">
                Book Your Court <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <img 
                src="padel.jpg"
                alt="Padel court"
                className="rounded-2xl shadow-lg"
              />
            </div>
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



