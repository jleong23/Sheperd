import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// NavBar
import NavBar from "./components/ui/NavBar";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/leaders/Login";
import Signup from "./pages/leaders/Signup";

// Leader Pages
import LeaderHome from "./pages/leaders/Home";
import Kids from "./pages/leaders/Kids";
import Attendance from "./pages/leaders/Attendance";
import Events from "./pages/leaders/Events";
import Catchups from "./pages/leaders/Catchups";
import KidProfile from "./components/kids/KidProfile";
import Footer from "./components/ui/Footer";
import NewPeople from "./components/newPeople/NewPeople";
import Splash from "./pages/leaders/Splash.jsx";

// Helper component to protect routes
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage={true} />;

  return token ? children : <Navigate to="/welcome" />;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <>
                <NavBar />
                <main className="pt-20">
                  <Routes>
                    <Route path="/" element={<LeaderHome />} />
                    <Route path="/kid-list" element={<Kids />} />
                    <Route path="/kids/:id" element={<KidProfile />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/catchups" element={<Catchups />} />
                    <Route path="/new-people" element={<NewPeople />} />
                  </Routes>
                </main>
                <Footer />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </div>
  );
}
