import { getUser } from "../utils/auth";

export default function Navbar() {
  const user = getUser();

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between">
      <h1 className="font-semibold text-gray-800">
        Finance Dashboard
      </h1>

      <div className="flex gap-4 items-center">
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {user?.role}
        </span>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="text-sm text-gray-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}