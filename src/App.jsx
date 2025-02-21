import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CourtDetail from "./pages/CourtDetails";
import AddCourt from "./pages/AddCourt";
import ListCourts from "./pages/ListCourts";
import CourtList from "./pages/ListCourtv1";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courts/:courtId" element={<CourtDetail />} />
      <Route path="/courts/add" element={<AddCourt/>}/>
      <Route path="/courts/list" element={<CourtList/>}/>


    </Routes>
  );
}

export default App;
