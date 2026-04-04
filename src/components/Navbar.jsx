export default function Navbar() {
  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">
        Finance Dashboard
      </h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="text-sm text-gray-600 hover:text-black"
      >
        Logout
      </button>
    </div>
  );
}