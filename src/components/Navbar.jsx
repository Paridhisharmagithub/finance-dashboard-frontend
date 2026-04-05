import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-lg font-semibold text-gray-800">
          Finance Dashboard
        </h1>

        {/* Links */}
        <div className="flex items-center gap-5 text-sm">

          <Link to="/dashboard" className="text-gray-600 hover:text-black">
            Dashboard
          </Link>

          <Link to="/transactions" className="text-gray-600 hover:text-black">
            Transactions
          </Link>

          {/* Admin only */}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-gray-600 hover:text-black">
              Admin
            </Link>
          )}

          {/* User Role Badge */}
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {user?.role}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}