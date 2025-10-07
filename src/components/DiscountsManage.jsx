"use client";
import { useState, useEffect } from "react";
import { Plus, X, Trash2, Tag, Calendar, Search } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function DiscountsManage() {
  const { discounts, products, addDiscount, updateDiscount, deleteDiscount } =
    useStore();
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [expires, setExpires] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [suggestions, setSuggestions] = useState([]);

  function todayISO() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function resetForm() {
    setProduct("");
    setAmount("");
    setExpires("");
    setEditing(null);
    setSuggestions([]);
  }

  function openAdd() {
    resetForm();
    setOpenForm(true);
  }

  function openEdit(item) {
    setEditing(item);
    setProduct(item.product);
    setAmount(String(item.amount));
    setExpires(item.expires);
    setOpenForm(true);
  }

  const handleProductSearch = (searchTerm) => {
    setProduct(searchTerm);

    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products
      .filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(filtered);
  };

  const handleSelectProduct = (selectedProduct) => {
    setProduct(selectedProduct.title);
    setSuggestions([]);
  };

  function saveOrUpdate() {
    const amt = Number(amount);
    if (!product.trim() || !expires || !amt || amt <= 0) return;

    const discountData = {
      id: editing ? editing.id : Date.now(),
      product: product.trim(),
      amount: amt,
      expires,
      created: todayISO(),
    };

    if (editing) {
      updateDiscount(discountData);
    } else {
      addDiscount(discountData);
    }

    resetForm();
    setOpenForm(false);
  }

  function askDelete(id) {
    setConfirmDelete({ open: true, id });
  }

  function cancelDelete() {
    setConfirmDelete({ open: false, id: null });
  }

  function confirmDeleteNow() {
    deleteDiscount(confirmDelete.id);
    setConfirmDelete({ open: false, id: null });
  }

  const visible = discounts.filter((d) =>
    `${d.product} ${d.amount}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const activeDiscounts = discounts.filter(
    (d) => new Date(d.expires) >= new Date()
  );

  return (
    <div className="w-full flex flex-col gap-8 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
            Discounts
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage fixed-amount discounts • {activeDiscounts.length} active
            discounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search discounts..."
              className="pl-10 pr-3 py-2 w-64 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:from-gray-200 hover:to-gray-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.12)]"
          >
            <Plus size={16} />
            Add Discount
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="text-sm text-gray-400">Total Discounts</div>
          <div className="text-xl font-semibold text-gray-100">
            {discounts.length}
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="text-sm text-gray-400">Active Discounts</div>
          <div className="text-xl font-semibold text-emerald-400">
            {activeDiscounts.length}
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="text-sm text-gray-400">Expired Discounts</div>
          <div className="text-xl font-semibold text-red-400">
            {discounts.length - activeDiscounts.length}
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-200">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Discount (EGP)</th>
                <th className="text-left py-3 px-4">Expires</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No discounts found.
                  </td>
                </tr>
              )}
              {visible.map((d) => {
                const expired = new Date(d.expires) < new Date();
                return (
                  <tr
                    key={d.id}
                    className="border-t border-[#2a2a2a] hover:bg-[#1a1a1a] transition"
                  >
                    <td className="py-3 px-4 text-gray-100 font-medium">
                      {d.product}
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-gray-200 font-semibold">
                        {d.amount} EGP
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{d.expires}</td>
                    <td className="py-3 px-4 text-gray-300">{d.created}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          expired
                            ? "bg-red-500/20 text-red-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {expired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(d)}
                          className="px-3 py-1 rounded-md bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => askDelete(d.id)}
                          className="px-3 py-1 rounded-md bg-[#1a1a1a] hover:bg-[#2a1a1a] text-red-400 transition inline-flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[95%] max-w-lg bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tag className="text-gray-300" size={20} />
                <h2 className="text-lg font-semibold text-gray-100">
                  {editing ? "Edit Discount" : "Add Discount"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setOpenForm(false);
                  resetForm();
                }}
                className="p-2 rounded-md text-gray-400 hover:bg-[#1a1a1a] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 relative">
                <label className="text-xs text-gray-400 mb-2 block">
                  Product *
                </label>
                <input
                  value={product}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  placeholder="Search and select product"
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2a2a2a] text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg mt-1 z-10 max-h-60 overflow-y-auto">
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex justify-between"
                      >
                        <span className="text-gray-200">{product.title}</span>
                        <span className="text-gray-400 text-sm">
                          Stock: {product.stock} | {product.price} EPG
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block">
                  Discount Amount (EGP) *
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2a2a2a] text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block">
                  Expiry Date *
                </label>
                <div className="relative">
                  <input
                    value={expires}
                    onChange={(e) => setExpires(e.target.value)}
                    type="date"
                    min={todayISO()}
                    className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2a2a2a] text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar size={16} />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => {
                    setOpenForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveOrUpdate}
                  disabled={!product.trim() || !amount || !expires}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 font-semibold hover:from-gray-200 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {editing ? "Update Discount" : "Save Discount"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
          <div className="w-[92%] max-w-sm bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                Confirm Delete
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Are you sure you want to delete this discount? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNow}
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
