import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import RoleRoute from "./auth/RoleRoute.jsx";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Load pages only when the user visits them.
const NavBar = lazy(() => import("./components/ui/navigation/NavBar.jsx"));
const Footer = lazy(() => import("./components/ui/Footer"));

const Login = lazy(() => import("./pages/leaders/Login"));
const Signup = lazy(() => import("./pages/leaders/Signup"));
const Splash = lazy(() => import("./pages/leaders/Splash.jsx"));

const LeaderHome = lazy(() => import("./pages/leaders/Home"));
const Kids = lazy(() => import("./pages/leaders/Kids"));
const Attendance = lazy(() => import("./pages/leaders/Attendance"));
const Events = lazy(() => import("./pages/leaders/Events"));
const Catchups = lazy(() => import("./pages/leaders/Catchups"));

const AllKids = lazy(() => import("./pages/pastors/AllKids.jsx"));
const PastorDashboard = lazy(
  () => import("./pages/pastors/PastorDashboard.jsx"),
);
const LeaderStats = lazy(() => import("./pages/pastors/LeaderStats.jsx"));

const KidProfile = lazy(() => import("./components/kids/KidProfile"));
const NewPeople = lazy(() => import("./components/newPeople/NewPeople"));

// Protect routes that require authentication.
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  return token ? children : <Navigate to="/welcome" replace />;
};

function AppRoutes() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner fullPage={true} />}>
        <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <>
                  <NavBar />

                  <main className="pt-20">
                    <Routes>
                      <Route
                        path="/pastor"
                        element={
                          <RoleRoute allowedRole="pastor">
                            <PastorDashboard />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="/pastor/leaders/:leaderId"
                        element={
                          <RoleRoute allowedRole="pastor">
                            <LeaderStats />
                          </RoleRoute>
                        }
                      />

                      <Route path="/" element={<LeaderHome />} />
                      <Route path="/kid-list" element={<Kids />} />
                      <Route path="/kids/:id" element={<KidProfile />} />
                      <Route path="/attendance" element={<Attendance />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/catchups" element={<Catchups />} />
                      <Route path="/new-people" element={<NewPeople />} />
                      <Route path="/all-kids" element={<AllKids />} />
                    </Routes>
                  </main>

                  <Footer />
                </>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>

      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </div>
  );
}
