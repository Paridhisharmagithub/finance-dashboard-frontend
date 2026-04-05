import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import RoleGate from "../components/RoleGate";
import { getUser } from "../utils/auth";

export default function Transactions() {
  const user = getUser();

  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
    startDate: "",
    endDate: ""
  });

  const [form, setForm] = useState({
    amount: "",
    type: "income",
    category: ""
  });

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    if (user?.role === "viewer") {
      setLoading(false); // 🔥 FIX
      return;
    }

    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await API.get("/transactions", {
        params: {
          page,
          type: filters.type || undefined,
          category: filters.category || undefined,
          search: filters.search || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined
        }
      });

      setTransactions(res.data.data);
      setMeta(res.data.meta);

    } catch (err) {
      setError("Failed to fetch transactions ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPage(1);
    fetchTransactions();
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch {
      setError("Delete failed ❌");
    }
  };

  /* ---------------- ADD / EDIT ---------------- */

  const handleSave = async () => {
    if (!form.amount || !form.category) {
      setError("Fill all fields");
      return;
    }

    try {
      if (form._id) {
        await API.put(`/transactions/${form._id}`, {
          ...form,
          amount: Number(form.amount)
        });
      } else {
        await API.post("/transactions", {
          ...form,
          amount: Number(form.amount)
        });
      }

      setForm({ amount: "", type: "income", category: "" });
      fetchTransactions();
      setError("");

    } catch {
      setError("Error saving transaction ❌");
    }
  };

  /* ---------------- VIEWER BLOCK ---------------- */

  if (user?.role === "viewer") {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="text-center mt-20 text-gray-500">
          You don’t have access to transactions
        </div>
      </div>
    );
  }

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <p className="text-center mt-20">Loading...</p>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <h1 className="text-xl font-semibold mb-4">Transactions</h1>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-3">

          <select
            className="border p-2 rounded text-sm"
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value })
            }
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            placeholder="Category"
            className="border p-2 rounded text-sm"
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          />

          <input
            placeholder="Search"
            className="border p-2 rounded text-sm"
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2 rounded text-sm"
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2 rounded text-sm"
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />

          <button
            className="bg-blue-600 text-white px-4 rounded text-sm"
            onClick={handleFilter}
          >
            Apply
          </button>
        </div>

        {/* ADD / EDIT FORM */}
        <RoleGate allowedRoles={["admin"]}>
          <div className="bg-white p-4 rounded shadow mb-6 flex gap-3 flex-wrap">

            <input
              placeholder="Amount"
              value={form.amount}
              className="border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            <input
              placeholder="Category"
              value={form.category}
              className="border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <select
              value={form.type}
              className="border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button
              className="bg-green-600 text-white px-4 rounded text-sm"
              onClick={handleSave}
            >
              {form._id ? "Update" : "Add"}
            </button>
          </div>
        </RoleGate>

        {/* LIST */}
        <div className="bg-white p-4 rounded shadow">

          {transactions.length === 0 && (
            <p className="text-gray-500 text-sm">
              No transactions found
            </p>
          )}

          {transactions.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center border-b py-2 text-sm"
            >
              <div>
                <p className="font-medium">{t.category}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  ₹{t.amount}
                </p>
                <p className="text-xs text-gray-500">{t.type}</p>
              </div>

              {user?.role === "admin" && (
                <div className="flex gap-3">
                  <button
                    className="text-blue-500 text-xs"
                    onClick={() => setForm(t)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-500 text-xs"
                    onClick={() => handleDelete(t._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between mt-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {meta.page || 1} of {meta.pages || 1}
          </span>

          <button
            disabled={page === meta.pages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}