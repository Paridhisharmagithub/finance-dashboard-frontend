import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import RoleGate from "../components/RoleGate";
import { getUser } from "../utils/auth";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const user = getUser();

  const [summary, setSummary] = useState({});
  const [category, setCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    type: "income",
    category: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const summaryRes = await API.get("/dashboard/summary");
      setSummary(summaryRes.data.data);

      if (user?.role !== "viewer") {
        const catRes = await API.get("/dashboard/category");
        setCategory(catRes.data.data);

        const txRes = await API.get("/transactions");
        setTransactions(txRes.data.data);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load data ❌");
    }
  };

  const handleAdd = async () => {
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
        fetchData();
        setError("");

    } catch (err) {
        setError("Error saving transaction ❌");
    }
    };

  const handleDelete = async (id) => {
    try {
        await API.delete(`/transactions/${id}`);
        fetchData();
    } catch (err) {
        setError("Delete failed ❌");
    }
};


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {user?.role === "viewer" && (
            <p className="text-gray-500 text-sm mb-4">
                You have read-only access to summary data.
            </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="Total Income" value={summary.totalIncome} />
          <SummaryCard title="Total Expense" value={summary.totalExpense} />
          <SummaryCard title="Balance" value={summary.netBalance} />
        </div>

        {/* Add Transaction (ADMIN ONLY) */}
        <RoleGate allowedRoles={["admin"]}>
          <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Add Transaction
            </h2>

            <div className="flex flex-wrap gap-3">
              <input
                placeholder="Amount"
                value={form.amount}
                className="border p-2 rounded-md text-sm"
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />

              <input
                placeholder="Category"
                value={form.category}
                className="border p-2 rounded-md text-sm"
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <select
                value={form.type}
                className="border p-2 rounded-md text-sm"
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <button
                className="bg-blue-600 text-white px-4 rounded-md text-sm"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
        </RoleGate>

        {/* Category Chart (ANALYST + ADMIN) */}
        <RoleGate allowedRoles={["analyst", "admin"]}>
          <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Category Breakdown
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={category}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalAmount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </RoleGate>

        {/* Transactions (ANALYST + ADMIN) */}
        <RoleGate allowedRoles={["analyst", "admin"]}>
            <div className="bg-white p-5 rounded-xl shadow-sm border">
                <h2 className="text-lg font-medium text-gray-800 mb-3">
                Transactions
                </h2>

                {transactions.length === 0 && (
                <p className="text-gray-500 text-sm">
                    No transactions yet
                </p>
                )}

                {transactions.map((t) => (
                <div
                    key={t._id}
                    className="flex justify-between items-center py-2 border-b text-sm"
                >
                    {/* Category */}
                    <span className="text-gray-700">{t.category}</span>

                    {/* Amount */}
                    <span className="text-gray-900 font-medium">
                    ₹{t.amount}
                    </span>

                    {/* Type */}
                    <span
                    className={
                        t.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                    >
                    {t.type}
                    </span>

                    {/* 🔥 ACTIONS (ADMIN ONLY) */}
                    {user?.role === "admin" && (
                        <div className="flex gap-3">
                            {/* Edit */}
                            <button
                                className="text-blue-500 text-xs"
                                onClick={() => setForm(t)}
                                >
                                Edit
                            </button>

                            {/* Delete */}
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
        </RoleGate>

      </div>
    </div>
  );
}