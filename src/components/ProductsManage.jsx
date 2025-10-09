"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Package,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
} from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ProductsManage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } =
    useStore();
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [editing, setEditing] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };
  const openEdit = (product) => {
    setEditing(product);
    setShowModal(true);
  };

  const saveProduct = (data) => {
    const now = new Date();
    const payload = {
      id: editing ? editing.id : Date.now(),
      title: data.title.trim() || "Untitled Product",
      category: data.category || "",
      price: data.price.trim() || "0",
      stock: data.stock.trim() || "0",
      cost: data.cost?.trim() || "0",
      date: `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${now.getFullYear()}`,
    };
    editing ? updateProduct(payload) : addProduct(payload);
    setShowModal(false);
    setEditing(null);
  };

  const resetFilters = () => {
    setQuery("");
    setFilterCategory("");
    setSortOrder("");
    setShowSearchResults(false);
  };

  const handleSearch = () => {
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setQuery("");
    setShowSearchResults(false);
  };

  const applySort = (list) => {
    if (sortOrder === "asc")
      return [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sortOrder === "desc")
      return [...list].sort((a, b) => Number(b.price) - Number(a.price));
    return list;
  };

  const filtered = applySort(
    products.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q && !`${p.title} ${p.category}`.toLowerCase().includes(q))
        return false;
      if (filterCategory && p.category !== filterCategory) return false;
      return true;
    })
  );

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
          Inventory
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and organize your products efficiently
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative min-w-[220px] w-full lg:w-[320px]">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-3 bg-[#2a2a2a] border border-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#3a3a3a] transition"
              >
                <Search size={18} />
              </button>
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-3 bg-[#2a2a2a] border border-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#3a3a3a] transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300"
          >
            <option value="">Sort by price</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] text-gray-300 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-all"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-lg text-gray-300 hover:bg-[#222] transition-all"
          >
            {viewMode === "table" ? (
              <LayoutGrid size={18} />
            ) : (
              <List size={18} />
            )}
            {viewMode === "table" ? "Grid" : "Table"}
          </button>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:from-gray-200 hover:to-gray-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.12)]"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-100">
            {products.length}
          </div>
          <div className="text-xs text-gray-500">Total Products</div>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-100">
            {products.filter((p) => !p.category || p.category === "").length}
          </div>
          <div className="text-xs text-gray-500">Uncategorized</div>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-100">
            {products.filter((p) => parseInt(p.stock) < 5).length}
          </div>
          <div className="text-xs text-red-400">Low Stock</div>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-100">
            {products.filter((p) => parseInt(p.stock) === 0).length}
          </div>
          <div className="text-xs text-red-500">Out of Stock</div>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-100">
            {categories.length}
          </div>
          <div className="text-xs text-gray-500">Categories</div>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-100">
            {products.reduce((sum, p) => sum + parseInt(p.stock), 0)}
          </div>
          <div className="text-xs text-gray-500">Total Stock</div>
        </div>
      </div>

      {/* Search Results Info */}
      {showSearchResults && query && (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-300 text-sm">
              Showing {filtered.length} results for "
              <span className="text-gray-100">{query}</span>"
            </p>
            <button
              onClick={clearSearch}
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {viewMode === "table" ? (
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6 overflow-x-auto">
          <table className="w-full text-sm text-gray-300 min-w-[720px]">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 px-3">Title</th>
                <th className="text-left py-2 px-3">Category</th>
                <th className="text-left py-2 px-3">Stock</th>
                <th className="text-left py-2 px-3">Price</th>
                <th className="text-left py-2 px-3">Cost</th>
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="bg-[#141414] hover:bg-[#1c1c1c] transition"
                >
                  <td className="py-3 px-3 text-gray-100">{p.title}</td>
                  <td className="py-3 px-3">
                    {p.category ? (
                      <span className="text-gray-300">{p.category}</span>
                    ) : (
                      <span className="text-gray-500 italic">
                        Uncategorized
                      </span>
                    )}
                  </td>
                  <td
                    className={`py-3 px-3 font-medium ${
                      parseInt(p.stock) === 0
                        ? "text-red-500"
                        : parseInt(p.stock) < 5
                        ? "text-red-400"
                        : parseInt(p.stock) < 10
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {p.stock}
                  </td>
                  <td className="py-3 px-3 text-gray-100">{p.price} EGP</td>
                  <td className="py-3 px-3 text-gray-500">
                    {p.cost || "0"} EGP
                  </td>
                  <td className="py-3 px-3 text-gray-500">{p.date}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-lg text-gray-300 hover:bg-[#222] transition"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-lg text-red-400 hover:bg-[#2a1a1a] transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    {query
                      ? "No products found matching your search."
                      : "No products found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col justify-between hover:bg-[#141414] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-[#141414] flex items-center justify-center border border-[#2a2a2a]">
                    <Package size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-100 font-medium">{p.title}</h3>
                    <p className="text-gray-400 text-xs">
                      {p.category || "Uncategorized"}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">{p.date}</div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-gray-100 font-semibold">
                    {p.price} EGP
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      parseInt(p.stock) === 0
                        ? "text-red-500"
                        : parseInt(p.stock) < 5
                        ? "text-red-400"
                        : parseInt(p.stock) < 10
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    Stock: {p.stock}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Cost: {p.cost || "0"} EGP
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-lg text-gray-300 hover:bg-[#222] transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-lg text-red-400 hover:bg-[#2a1a1a] transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              {query
                ? "No products found matching your search."
                : "No products found."}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal
          editing={editing}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}

function Modal({ editing, categories, onClose, onSave }) {
  const [title, setTitle] = useState(editing ? editing.title : "");
  const [category, setCategory] = useState(editing ? editing.category : "");
  const [stock, setStock] = useState(editing ? editing.stock : "");
  const [price, setPrice] = useState(editing ? editing.price : "");
  const [cost, setCost] = useState(editing ? editing.cost || "" : "");

  const handleSave = () => {
    onSave({ title, category, stock, price, cost });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl w-[95%] max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-100">
            {editing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Product Name"
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            placeholder="Stock Quantity"
            min="0"
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="text"
            placeholder="Selling Price (EGP)"
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          <input
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            type="text"
            placeholder="Cost Price (EGP)"
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] hover:bg-[#2a2a2a] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 font-semibold hover:from-gray-200 hover:to-gray-400 transition-all"
            >
              {editing ? "Update" : "Add"} Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
