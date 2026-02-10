import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthForm from "./AuthForm";
import { useAuthForm } from "../../hooks/useAuthForm";
import AuthLayout from "./AuthLayout";

export default function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const { values, error, handleChange, handleSubmit } = useAuthForm(
    ({ email, password }) => login(email, password),
  );

  return (
    <AuthLayout
      title="Sign in to your account"
      footer={
        <p className="mt-10 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <AuthForm
        values={values}
        error={error}
        onSubmit={handleSubmit}
        buttonText="Sign in"
        fields={[
          {
            name: "email",
            type: "email",
            label: "Email address",
            required: true,
            autoComplete: "email",
            onChange: handleChange,
          },
          {
            name: "password",
            type: "password",
            label: "Password",
            required: true,
            autoComplete: "current-password",
            onChange: handleChange,
          },
        ]}
      />
    </AuthLayout>
  );
}
