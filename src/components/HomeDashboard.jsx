"use client";
import React from "react";
import { Package, ShoppingBag, Percent, TrendingUp } from "lucide-react";
import { useStore } from "@/store/useStore";

const Home = () => {
  const { products, sales, getStats } = useStore();
  const stats = getStats();

  const dashboardCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      title: "Total Sales",
      value: sales.length,
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

  const recentSales = sales.slice(0, 5);
  const lowStockProducts = products.filter((p) => parseInt(p.stock) < 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your store's performance and activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5 shadow-[0_0_25px_rgba(0,0,0,0.35)] flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <h2 className="text-xl font-semibold text-gray-100">
                {card.value}
              </h2>
            </div>
            <card.icon className="text-gray-400" size={26} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Recent Sales
          </h2>
          {recentSales.length > 0 ? (
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
                >
                  <div>
                    <p className="text-gray-100 font-medium">{sale.title}</p>
                    <p className="text-gray-400 text-sm">{sale.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-100 font-semibold">
                      {sale.total} EGP
                    </p>
                    <p className="text-gray-400 text-sm">Qty: {sale.count}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm text-center py-6">
              No sales recorded yet.
            </div>
          )}
        </div>

        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Low Stock Alert
          </h2>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border-l-4 border-red-500"
                >
                  <div>
                    <p className="text-gray-100 font-medium">{product.title}</p>
                    <p className="text-gray-400 text-sm">{product.category}</p>
                  </div>
                  <div className="text-red-400 font-semibold">
                    {product.stock} left
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm text-center py-6">
              All products have sufficient stock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
