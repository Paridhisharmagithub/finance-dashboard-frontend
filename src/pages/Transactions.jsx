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
    search: ""
  });

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions", {
        params: {
          page,
          type: filters.type || undefined,
          category: filters.category || undefined,
          search: filters.search || undefined
        }
      });

      setTransactions(res.data.data);
      setMeta(res.data.meta);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      setError("Delete failed ❌");
    }
  };

  const handleFilter = () => {
    setPage(1);
    fetchTransactions();
  };

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

          <button
            className="bg-blue-600 text-white px-4 rounded text-sm"
            onClick={handleFilter}
          >
            Apply
          </button>
        </div>

        {/* TRANSACTION LIST */}
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

              {/* DELETE (ADMIN ONLY) */}
              <RoleGate allowedRoles={["admin"]}>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </RoleGate>
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