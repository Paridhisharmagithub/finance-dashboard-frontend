import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import RoleGate from "../components/RoleGate";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, role) => {
    await API.patch(`/users/${id}/role`, { role });
    fetchUsers();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-xl font-semibold mb-4">
          Admin Panel
        </h1>

        <RoleGate allowedRoles={["admin"]}>
          <div className="bg-white p-5 rounded shadow">

            {users.map((u) => (
              <div
                key={u._id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-medium">{u.email}</p>
                  <p className="text-sm text-gray-500">{u.role}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="text-blue-500 text-xs"
                    onClick={() => changeRole(u._id, "analyst")}
                  >
                    Make Analyst
                  </button>

                  <button
                    className="text-green-600 text-xs"
                    onClick={() => changeRole(u._id, "admin")}
                  >
                    Make Admin
                  </button>
                </div>
              </div>
            ))}

          </div>
        </RoleGate>

      </div>
    </div>
  );
}