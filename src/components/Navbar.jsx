import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        if (token) {
          const res = await axios.get("http://localhost:5000/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setUser(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const NavLink = ({ href, children }) => (
    <Link to={href} className="text-white hover:text-blue-200 transition duration-300">
      {children}
    </Link>
  );

  const MobileNavLink = ({ href, onClick, children }) => (
    <Link to={href} className="block text-white hover:text-blue-200 transition duration-300" onClick={onClick}>
      {children}
    </Link>
  );

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 right-0 w-full bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold">
            SportCourt
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-24">
            <NavLink href="/courts/list">Courts</NavLink>
            <NavLink href="/mybookings">My Bookings</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          {/* User Profile / Login Button */}
          <div className="hidden md:block">
            <button
              onClick={handleProfileClick}
              className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold flex items-center transition duration-300 hover:bg-blue-100"
            >
              <User className="w-5 h-5 mr-2" />
              {user ? user.name : "Login"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 transition-all duration-300 ease-in-out">
            <MobileNavLink href="/courts" onClick={toggleMenu}>
              Courts
            </MobileNavLink>
            <MobileNavLink href="/bookings" onClick={toggleMenu}>
              My Bookings
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={toggleMenu}>
              About
            </MobileNavLink>
            <button
              onClick={handleProfileClick}
              className="w-full bg-white text-blue-600 px-4 py-2 rounded-full font-semibold flex items-center justify-center transition duration-300 hover:bg-blue-100"
            >
              <User className="w-5 h-5 mr-2" />
              {user ? user.name : "Profile"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

