import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthForm(authFn, redirectTo = "/") {
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await authFn(values);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return { values, error, handleChange, handleSubmit };
}
