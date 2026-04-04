export default function SummaryCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold text-gray-800 mt-1">
        ₹{value || 0}
      </h2>
    </div>
  );
}