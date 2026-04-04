import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [category, setCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: "", type: "income", category: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    API.get("/dashboard/summary").then(res => setSummary(res.data));
    API.get("/dashboard/category").then(res => setCategory(res.data));
    API.get("/transactions").then(res => setTransactions(res.data));
  };

  const handleAdd = async () => {
    await API.post("/transactions", form);
    setForm({ amount: "", type: "income", category: "" });
    fetchData();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="Total Income" value={summary.totalIncome} />
          <SummaryCard title="Total Expense" value={summary.totalExpense} />
          <SummaryCard title="Balance" value={summary.balance} />
        </div>

        {/* Add Transaction */}
        <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Add Transaction
          </h2>

          <div className="flex flex-wrap gap-3">
            <input
              placeholder="Amount"
              value={form.amount}
              className="border p-2 rounded-md text-sm"
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <input
              placeholder="Category"
              value={form.category}
              className="border p-2 rounded-md text-sm"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <select
              value={form.type}
              className="border p-2 rounded-md text-sm"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
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

        {/* Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Category Breakdown
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={category}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Transactions
          </h2>

          {transactions.map(t => (
            <div
              key={t._id}
              className="flex justify-between py-2 border-b text-sm"
            >
              <span className="text-gray-700">{t.category}</span>
              <span className="text-gray-900 font-medium">₹{t.amount}</span>
              <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                {t.type}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}