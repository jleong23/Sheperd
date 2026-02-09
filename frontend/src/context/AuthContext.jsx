import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 1. Initialize state from localStorage so login persists on refresh
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Configure Axios
  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:4000";

    // Setup Axios Interceptor to attach token to every request
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // 3. On initial load, fetch the user profile
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await axios.get("/auth/me");
          setUser(res.data);
        } catch (err) {
          // Token is invalid or expired
          console.error("Failed to load user from token, logging out.");
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    };
    loadUser().finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    const newToken = res.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Fetch user profile immediately after login
    const userRes = await axios.get("/auth/me");
    setUser(userRes.data);
  };

  const signup = async (email, password) => {
    const res = await axios.post("/auth/register", { email, password });
    const newToken = res.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Fetch user profile immediately after signup
    const userRes = await axios.get("/auth/me");
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, signup, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
