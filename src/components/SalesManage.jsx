"use client";
import { useState, useEffect } from "react";
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
  Tag,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useModal } from "@/hooks/useModal";

export default function SalesManage() {
  const { products, sales, addSale, deleteSale, getStats, getProductDiscount } =
    useStore();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    productId: "",
    count: "1",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isClient, setIsClient] = useState(false);
  const { showError, showSuccess, showConfirm, showInfo } = useModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Auto-search when typing
  const handleSearchChange = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setFormData((prev) => ({ ...prev, productId: "", price: "" }));
      return;
    }

    const filtered = products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term.toLowerCase()) &&
          parseInt(p.stock) > 0
      )
      .slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectProduct = (product) => {
    const discount = getProductDiscount(product.id);
    let finalPrice = product.price;

    if (discount) {
      if (discount.type === "percentage") {
        finalPrice = product.price * (1 - discount.amount / 100);
      } else {
        finalPrice = Math.max(0, product.price - discount.amount);
      }
    }

    setFormData((prev) => ({
      ...prev,
      productId: product.id,
      price: finalPrice.toString(),
    }));
    setSearchTerm(product.title);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleAddSale = (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.count || !formData.price) {
      showError("Please fill all required fields");
      return;
    }

    const selected = products.find((p) => p.id === formData.productId);
    if (!selected) {
      showError("Product not found");
      return;
    }

    if (parseInt(selected.stock) < parseInt(formData.count)) {
      showError(`Not enough stock. Available: ${selected.stock}`);
      return;
    }

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
    setSearchTerm("");
    setShowSuggestions(false);
    setSuggestions([]);

    showSuccess("Sale added successfully!");
  };

  const handleDeleteSale = (id) => {
    showConfirm(
      "Are you sure you want to delete this sale? The product quantity will be restored.",
      () => {
        deleteSale(id);
        showSuccess("Sale deleted successfully.");
      },
      "Delete Sale"
    );
  };

  const getDiscountBadge = (productId) => {
    const discount = getProductDiscount(productId);
    if (!discount) return null;

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md border border-green-500/30">
        <Tag size={10} />
        {discount.type === "percentage"
          ? `${discount.amount}% OFF`
          : `${discount.amount} EGP OFF`}
      </span>
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setFormData((prev) => ({ ...prev, productId: "", price: "" }));
  };

  if (!isClient) {
    return (
      <div className="w-full flex flex-col gap-8 pb-10">
        <div className="animate-pulse">
          <div className="h-8 bg-[#1a1a1a] rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-[#1a1a1a] rounded w-1/2 mb-8"></div>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Enter product name"
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-3 bg-[#2a2a2a] border border-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#3a3a3a] transition"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg mt-1 z-20 max-h-60 overflow-y-auto shadow-lg">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="px-4 py-3 hover:bg-[#2a2a2a] cursor-pointer flex flex-col border-b border-[#2a2a2a] last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200 font-medium">
                        {product.title}
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-green-400 text-sm font-medium">
                        {getProductDiscount(product.id) ? (
                          <>
                            <span className="line-through text-gray-500 mr-2">
                              {product.price} EGP
                            </span>
                            {(getProductDiscount(product.id).type ===
                            "percentage"
                              ? product.price *
                                (1 -
                                  getProductDiscount(product.id).amount / 100)
                              : Math.max(
                                  0,
                                  product.price -
                                    getProductDiscount(product.id).amount
                                )
                            ).toFixed(2)}{" "}
                            EGP
                          </>
                        ) : (
                          `${product.price} EGP`
                        )}
                      </span>
                      {getProductDiscount(product.id) && (
                        <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded">
                          {getProductDiscount(product.id).type === "percentage"
                            ? `${getProductDiscount(product.id).amount}% OFF`
                            : `${
                                getProductDiscount(product.id).amount
                              } EGP OFF`}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {showSuggestions && suggestions.length === 0 && searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg mt-1 z-20 p-4 text-center text-gray-400">
                No products found
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-2">Price (EGP) *</label>
            <div className="relative">
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, price: e.target.value }))
                }
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
                required
                step="0.01"
                min="0"
              />
              {getProductDiscount(formData.productId) && (
                <div className="absolute -top-2 right-2">
                  {getDiscountBadge(formData.productId)}
                </div>
              )}
            </div>
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
                  <td className="py-3 px-3 text-gray-100">
                    <div className="flex items-center gap-2">
                      {sale.title}
                      {sale.discountId && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                          <Tag size={8} />
                          Discount
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {sale.discountId ? (
                      <div className="flex flex-col">
                        <span className="text-green-400">{sale.price} EGP</span>
                        <span className="text-xs text-gray-500 line-through">
                          {sale.originalPrice} EGP
                        </span>
                      </div>
                    ) : (
                      `${sale.price} EGP`
                    )}
                  </td>
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
