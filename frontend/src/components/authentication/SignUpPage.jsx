// frontend/src/pages/Signup.jsx
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthForm from "./AuthForm";
import { useAuthForm } from "../../hooks/useAuthForm";
import AuthLayout from "./AuthLayout";
import { signup as supabaseSignup } from "../../api/auth";
import toast from "react-hot-toast";

export default function SignupPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSignup = async ({ userName, email, password }) => {
    try {
      const data = await supabaseSignup({ userName, email, password });
      // If signup requires email confirmation, data.session will be null.
      if (data.user && !data.session) {
        toast.success(
          "Account created! Please check your email to verify your account.",
        );
        navigate("/login");
      } else if (data.session) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create account");
    }
  };

  const { values, error, handleChange, handleSubmit } =
    useAuthForm(handleSignup);

  return (
    <AuthLayout
      title="Create your account"
      footer={
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600">
            Log in
          </Link>
        </p>
      }
    >
      <AuthForm
        values={values}
        error={error}
        onSubmit={handleSubmit}
        buttonText="Sign up"
        fields={[
          {
            name: "userName",
            label: "User Name",
            required: true,
            onChange: handleChange,
          },
          {
            name: "email",
            type: "email",
            label: "Email address",
            required: true,
            onChange: handleChange,
          },
          {
            name: "password",
            type: "password",
            label: "Password",
            required: true,
            onChange: handleChange,
          },
        ]}
      />
    </AuthLayout>
  );
}
