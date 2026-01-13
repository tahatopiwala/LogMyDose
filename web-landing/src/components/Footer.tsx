import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
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
              <span className="text-xl font-bold">LogMyDose</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Smart peptide therapy tracking with AI-powered insights. Track
              your doses, monitor progress, and optimize your results.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="https://app.logmydose.com"
                  className="hover:text-white transition-colors"
                >
                  App
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@logmydose.com"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} LogMyDose. All rights reserved.
          </p>
          <p className="mt-2">
            Not medical advice. Always consult with your healthcare provider
            about your treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
