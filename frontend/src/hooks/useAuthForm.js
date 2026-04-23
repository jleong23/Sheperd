/**
 * hooks/useAuthForm.js - Generic Authentication form handler Hook
 * This hook abstracts common authentication form behaviour:
 * - Managing form state (inputs)
 * - Handling input changes
 * - Submitting authentication requests
 * - Error handling
 * - Post-auth navigation
 *
 * It is designed to be reusable across:
 * - Login forms
 * - Signup forms
 * - Any auth-related form that follows a similar pattern
 *
 * The actual authentication logic is injected via `authFn`,
 * making this hook fully decoupled from Supabase or any auth provider.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @hook useAuthForm
 * @description Handles form state + submission logic authentication forms
 *
 * @param {Function} authFn
 * Function that performs authentication (e.g. login or signup API call)
 *
 * @param {string} redirectTo
 * Route to navigate to after successful authentication
 */
export function useAuthForm(authFn, redirectTo = "/") {
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Updates form state dynamically based on input name/value
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * 1. Prevent default form submission
   * 2. Reset previous errors
   * 3. Call injected authentication function (authFn)
   * 4. Navigate on success
   * 5. Capture and display authentication errors
   */
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
