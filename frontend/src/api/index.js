import axios from "axios";
import { supabase } from "../supabaseClient";

const api = axios.create({
  // uncomment below when deploying to production
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  // baseURL: "http://localhost:4000",
});

let cachedSession = null;

supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session;
});

api.interceptors.request.use(async (config) => {
  let token = cachedSession?.access_token;

  if (!token) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
