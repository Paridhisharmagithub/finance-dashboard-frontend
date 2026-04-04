import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const url = isLogin ? "/auth/login" : "/auth/register";

      const res = await API.post(url, form);

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-xl shadow-md w-80 border">

        <h2 className="text-xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Register Name */}
        {!isLogin && (
          <input
            placeholder="Name"
            className="w-full mb-3 p-2 border rounded-md text-sm"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded-md text-sm"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded-md text-sm"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded-md text-sm hover:bg-blue-700"
          onClick={handleSubmit}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {/* Toggle */}
        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span
            className="text-blue-600 cursor-pointer ml-1"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setForm({});
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>

      </div>

    </div>
  );
}