import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CourtDetail from "./pages/CourtDetails";
import AddCourt from "./pages/AddCourt";
import ListCourts from "./pages/ListCourts";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/Profile";
import EditCourt from "./components/EditCourt";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import BookingDetails from "./pages/BookingDetails";

function App() {
  const location = useLocation();
  const showNavbar = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "mt-16" : ""}></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/bookings/:bookingId" element={<BookingDetails />} />
        <Route path="/courts/:courtId" element={<CourtDetail />} />
        <Route path="/courts/add" element={<AddCourt />} />
        <Route path="/courts/list" element={<ListCourts />} />
        <Route path ="/payment" element={<Payment />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/edit/:courtId" element={<EditCourt />} />
        
      </Routes>
    </>
  );
}

export default App;
