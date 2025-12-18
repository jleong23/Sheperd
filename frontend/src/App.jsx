import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// NavBar
import NavBar from "./components/ui/NavBar";
import { toast, Toaster } from "react-hot-toast";

// Leader Pages
import LeaderHome from "./pages/leaders/Home";
import Kids from "./pages/leaders/Kids";
import Attendance from "./pages/leaders/Attendance";
import Events from "./pages/leaders/Events";

function AppWithRouter() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LeaderHome />} />
        <Route path="/kid-list" element={<Kids />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/events" element={<Events />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
export default function App() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Router>
        <AppWithRouter />
      </Router>
    </div>
  );
}
