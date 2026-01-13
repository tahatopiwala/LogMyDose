import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/auth";

export function Signup() {
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const hasMinLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!hasMinLength || !hasUppercase || !hasSpecialChar) {
      errors.password = "Password does not meet all requirements";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await register({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.details) {
        // Handle field-specific validation errors
        const newFieldErrors: Record<string, string> = {};
        apiError.details.forEach((detail) => {
          newFieldErrors[detail.path] = detail.message;
        });
        setFieldErrors(newFieldErrors);
      } else {
        setError(apiError.error || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg
            className="w-12 h-12"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" className="fill-primary-600" />
            <rect x="10" y="7" width="6" height="14" rx="1" fill="white" />
            <rect x="11.5" y="4" width="3" height="4" rx="0.5" fill="white" />
            <rect x="12" y="21" width="2" height="5" fill="white" />
            <polygon points="13,26 11.5,28 14.5,28" fill="white" />
            <line
              x1="10"
              y1="10"
              x2="12"
              y2="10"
              className="stroke-primary-600"
              strokeWidth="0.75"
            />
            <line
              x1="10"
              y1="13"
              x2="12"
              y2="13"
              className="stroke-primary-600"
              strokeWidth="0.75"
            />
            <line
              x1="10"
              y1="16"
              x2="12"
              y2="16"
              className="stroke-primary-600"
              strokeWidth="0.75"
            />
            <path
              d="M22 14 C22 14 19 18 19 20.5 C19 22.5 20.3 24 22 24 C23.7 24 25 22.5 25 20.5 C25 18 22 14 22 14 Z"
              fill="white"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    fieldErrors.password ? "border-red-300" : "border-gray-300"
                  }`}
                />
              </div>
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        hasMinLength ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasMinLength ? (
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${hasMinLength ? "text-green-600" : "text-gray-500"}`}
                    >
                      At least 12 characters ({password.length}/12)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        hasUppercase ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasUppercase ? (
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${hasUppercase ? "text-green-600" : "text-gray-500"}`}
                    >
                      At least 1 uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        hasSpecialChar ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasSpecialChar ? (
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${hasSpecialChar ? "text-green-600" : "text-gray-500"}`}
                    >
                      At least 1 special character
                    </span>
                  </div>
                </div>
              )}
              {password.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  Must be at least 12 characters, 1 uppercase, 1 special
                  character
                </p>
              )}
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a
              href="https://logmydose.com/terms"
              className="text-primary-600 hover:text-primary-500"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="https://logmydose.com/privacy"
              className="text-primary-600 hover:text-primary-500"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
