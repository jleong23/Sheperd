import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// NavBar
import NavBar from "./components/ui/NavBar";
import { toast, Toaster } from "react-hot-toast";

// Leader Pages
import LeaderHome from "./pages/leaders/Home";
import Kids from "./pages/leaders/Kids";
import Attendance from "./pages/leaders/Attendance";
import Events from "./pages/leaders/Events";
import Catchups from "./pages/leaders/Catchups";

function AppWithRouter() {
  return (
    <>
      <NavBar />
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<LeaderHome />} />
          <Route path="/kid-list" element={<Kids />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/events" element={<Events />} />
          <Route path="/catchups" element={<Catchups />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </>
  );
}
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Router>
        <AppWithRouter />
      </Router>
    </div>
  );
}
