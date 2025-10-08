const DataStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <StatCard value={stats.products} label="Products" />
    <StatCard value={stats.sales} label="Sales" />
    <StatCard value={stats.discounts} label="Discounts" />
    <StatCard value={stats.lastUpdate} label="Last Update" isDate />
  </div>
);

const StatCard = ({ value, label, isDate = false }) => (
  <div className="bg-[#1a1a1a] p-3 rounded-lg text-center">
    <div
      className={`${
        isDate ? "text-sm font-medium" : "text-2xl font-bold"
      } text-gray-100`}
    >
      {value}
    </div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

export default DataStats;
