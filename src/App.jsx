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
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mybookings"
          element={
            <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
              <BookingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courts/:courtId"
          element={
            <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
              <CourtDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courts/add"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <AddCourt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courts/list"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <ListCourts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:courtId"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <EditCourt />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
