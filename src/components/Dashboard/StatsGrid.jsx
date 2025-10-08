import { Package, ShoppingBag, TrendingUp, Percent } from "lucide-react";

const StatsGrid = ({ stats, salesCount }) => {
  const dashboardCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      title: "Total Sales",
      value: salesCount,
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: `${stats.totalSales.toLocaleString()} EGP`,
      icon: TrendingUp,
    },
    {
      title: "Total Discounts",
      value: `-${stats.totalDiscounts.toLocaleString()} EGP`,
      icon: Percent,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5 shadow-[0_0_25px_rgba(0,0,0,0.35)] flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-semibold text-gray-100">{value}</h2>
    </div>
    <Icon className="text-gray-400" size={26} />
  </div>
);

export default StatsGrid;
