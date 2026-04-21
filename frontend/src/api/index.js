import axios from "axios";
import { supabase } from "../supabaseClient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

let cachedSession = null;

supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session;
});

api.interceptors.request.use((config) => {
  const token = cachedSession?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
