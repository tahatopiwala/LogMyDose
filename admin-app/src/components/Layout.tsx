import { Link, useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Substances",
    href: "/substances",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    name: "Protocol Templates",
    href: "/protocols",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center gap-2 border-b border-gray-200">
          <svg
            className="w-8 h-8"
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
          <h1 className="text-xl font-bold text-primary-600">Admin</h1>
        </div>
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive
                      ? "text-primary-600"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6 px-8">{children}</main>
      </div>
    </div>
  );
}
