"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { useStore } from "@/store/useStore";

export default function SalesManage() {
  const { products, sales, addSale, deleteSale, getStats } = useStore();
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    count: "1",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const stats = getStats();

  const summaryCards = [
    {
      title: "Revenue",
      value: `${stats.totalSales.toLocaleString()} EGP`,
      icon: DollarSign,
    },
    {
      title: "Profit",
      value: `${stats.totalProfit.toLocaleString()} EGP`,
      icon: TrendingUp,
    },
    {
      title: "Total Sales",
      value: sales.length.toString(),
      icon: ShoppingCart,
    },
    { title: "Products", value: stats.totalProducts.toString(), icon: Users },
  ];

  const salesData = generateSalesData(sales);

  const handleProductSearch = (term) => {
    if (!term.trim()) {
      setSuggestions([]);
      setFormData((p) => ({ ...p, productId: "", price: "" }));
      return;
    }

    const filtered = products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term.toLowerCase()) &&
          parseInt(p.stock) > 0
      )
      .slice(0, 5);

    setSuggestions(filtered);
  };

  const handleSelectProduct = (product) => {
    setFormData((prev) => ({
      ...prev,
      productId: product.id,
      price: product.price,
    }));
    setSuggestions([]);
  };

  const handleAddSale = (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.count || !formData.price) {
      alert("Please fill all required fields");
      return;
    }

    const selected = products.find((p) => p.id === formData.productId);
    if (!selected) return alert("Product not found");
    if (parseInt(selected.stock) < parseInt(formData.count))
      return alert(`Not enough stock. Available: ${selected.stock}`);

    addSale({
      id: Date.now(),
      productId: formData.productId,
      title: selected.title,
      price: formData.price,
      count: formData.count,
      total: (parseFloat(formData.price) * parseInt(formData.count)).toString(),
      category: selected.category,
      date: formData.date,
    });

    setFormData({
      productId: "",
      count: "1",
      price: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleDeleteSale = (id) => setConfirmDelete({ open: true, id });
  const confirmDeleteSale = () => {
    deleteSale(confirmDelete.id);
    setConfirmDelete({ open: false, id: null });
  };
  const cancelDelete = () => setConfirmDelete({ open: false, id: null });

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="px-3 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
          Sales Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track daily performance and revenue insights
        </p>
      </div>

      {/* Add Sale Form */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 sm:p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
        <h2 className="text-lg font-medium text-gray-100 mb-5">Add New Sale</h2>
        <form
          onSubmit={handleAddSale}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Product Search */}
          <div className="flex flex-col relative">
            <label className="text-sm text-gray-400 mb-2">Product Name *</label>
            <input
              type="text"
              value={
                products.find((p) => p.id === formData.productId)?.title || ""
              }
              onChange={(e) => handleProductSearch(e.target.value)}
              placeholder="Search for a product..."
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg mt-1 z-20 max-h-60 overflow-y-auto">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex justify-between"
                  >
                    <span className="text-gray-200">{product.title}</span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      Stock: {product.stock} | {product.price} EGP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-2">Price (EGP) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((p) => ({ ...p, price: e.target.value }))
              }
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-2">Quantity *</label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) =>
                setFormData((p) => ({ ...p, count: e.target.value }))
              }
              min="1"
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((p) => ({ ...p, date: e.target.value }))
              }
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2a2a2a] text-gray-100 font-medium rounded-lg border border-[#3a3a3a] hover:bg-[#3a3a3a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Add Sale
            </button>
          </div>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {summaryCards.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 sm:p-5 flex items-center justify-between hover:bg-[#141414] transition-all duration-300"
          >
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-500">{title}</span>
              <span className="text-lg sm:text-xl font-semibold text-gray-100">
                {value}
              </span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400">
              <Icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 sm:p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
        <h2 className="text-lg font-medium text-gray-100 mb-4">
          Sales Chart (EGP)
        </h2>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "10px",
                }}
                formatter={(value) => [`${value} EGP`, "Sales"]}
              />
              <Bar dataKey="sales" fill="#666" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 sm:p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)] overflow-x-auto">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Recent Sales</h2>
        <table className="min-w-[700px] w-full text-sm text-gray-300 border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left py-2 px-3">Product</th>
              <th className="text-left py-2 px-3">Price</th>
              <th className="text-left py-2 px-3">Count</th>
              <th className="text-left py-2 px-3">Category</th>
              <th className="text-left py-2 px-3">Total</th>
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-left py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length ? (
              sales.slice(0, 10).map((sale) => (
                <tr
                  key={sale.id}
                  className="bg-[#1a1a1a] hover:bg-[#202020] transition rounded-lg"
                >
                  <td className="py-3 px-3 text-gray-100">{sale.title}</td>
                  <td className="py-3 px-3">{sale.price} EGP</td>
                  <td className="py-3 px-3">{sale.count}</td>
                  <td className="py-3 px-3">{sale.category}</td>
                  <td className="py-3 px-3">{sale.total} EGP</td>
                  <td className="py-3 px-3 text-gray-500">{sale.date}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleDeleteSale(sale.id)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1a1a1a] text-red-400 hover:bg-[#2a1a1a] transition"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No sales recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-100">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Are you sure you want to delete this sale? The product quantity
              will be restored.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSale}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateSalesData(sales) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (!sales.length) return days.map((d) => ({ name: d, sales: 0 }));

  const result = sales.reduce((acc, s) => {
    const d = new Date(s.date);
    const idx = (d.getDay() + 6) % 7;
    acc[days[idx]] = (acc[days[idx]] || 0) + parseFloat(s.total);
    return acc;
  }, {});

  return days.map((d) => ({ name: d, sales: result[d] || 0 }));
}
