import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RoleRoute({ children, allowedRole }) {
  const { user, profile, loading } = useAuth();

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (profile.role !== allowedRole) {
    console.log("Access denied:", {
      role: profile.role,
      allowedRole,
    });

    return <Navigate to="/" />;
  }

  return children;
}
