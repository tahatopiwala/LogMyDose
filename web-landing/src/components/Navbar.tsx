import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  className="fill-primary-600"
                />
                <rect x="10" y="7" width="6" height="14" rx="1" fill="white" />
                <rect
                  x="11.5"
                  y="4"
                  width="3"
                  height="4"
                  rx="0.5"
                  fill="white"
                />
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
              <span className="text-xl font-bold text-gray-900">LogMyDose</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://app.logmydose.com/login"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </a>
            <a
              href="https://app.logmydose.com/signup"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                How It Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <hr className="border-gray-100" />
              <a
                href="https://app.logmydose.com/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </a>
              <a
                href="https://app.logmydose.com/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-center hover:bg-primary-700"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
