"use client";
import { useState } from "react";
import { Plus, Trash2, Tag, Edit3 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useModal } from "@/hooks/useModal";

export default function CategoryManager() {
  const {
    products,
    categories,
    addCategory,
    deleteCategory,
    updateProductCategory,
  } = useStore();
  const { showError, showSuccess, showConfirm } = useModal();
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");

  const handleAddCategory = (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      showError("Please enter a category name");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      showError("Category already exists");
      return;
    }

    addCategory(newCategory.trim());
    setNewCategory("");
    showSuccess("Category added successfully!");
  };

  const handleDeleteCategory = (category) => {
    const productsInCategory = products.filter((p) => p.category === category);

    if (productsInCategory.length > 0) {
      showConfirm(
        `This category has ${productsInCategory.length} product(s). Deleting it will remove the category from all products. Continue?`,
        () => {
          // Remove category from all products
          productsInCategory.forEach((product) => {
            updateProductCategory(product.id, "");
          });

          deleteCategory(category);
          showSuccess("Category deleted successfully!");
        },
        "Delete Category"
      );
    } else {
      deleteCategory(category);
      showSuccess("Category deleted successfully!");
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setEditName(category);
  };

  const handleUpdateCategory = () => {
    if (!editName.trim()) {
      showError("Please enter a category name");
      return;
    }

    if (
      editName.trim() !== editingCategory &&
      categories.includes(editName.trim())
    ) {
      showError("Category name already exists");
      return;
    }

    // Update category in all products
    const productsInCategory = products.filter(
      (p) => p.category === editingCategory
    );
    productsInCategory.forEach((product) => {
      updateProductCategory(product.id, editName.trim());
    });

    // Update category name in categories list
    const updatedCategories = categories.map((cat) =>
      cat === editingCategory ? editName.trim() : cat
    );

    // This would require adding a updateCategories action to your store
    // For now, we'll delete and recreate
    deleteCategory(editingCategory);
    addCategory(editName.trim());

    setEditingCategory(null);
    setEditName("");
    showSuccess("Category updated successfully!");
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName("");
  };

  const getProductCount = (category) => {
    return products.filter((p) => p.category === category).length;
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
      <h2 className="text-lg font-medium text-gray-100 mb-2">
        Category Management
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Add, edit, or delete product categories
      </p>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#2a2a2a] text-gray-100 font-medium rounded-lg border border-[#3a3a3a] hover:bg-[#3a3a3a] transition flex items-center gap-2"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </form>

      {/* Categories List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Existing Categories
        </h3>

        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Tag size={32} className="mx-auto mb-3 opacity-50" />
            <p>No categories yet. Add your first category above.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#202020] transition"
            >
              {editingCategory === category ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateCategory}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30 hover:bg-green-500/30 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-[#2a2a2a] text-gray-400 rounded border border-[#3a3a3a] hover:bg-[#3a3a3a] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-gray-400">
                      <Tag size={14} />
                    </div>
                    <div>
                      <span className="text-gray-200 font-medium">
                        {category}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProductCount(category)} product(s)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(category)}
                      className="p-2 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-lg transition"
                      title="Edit category"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-[#2a1a1a] rounded-lg transition"
                      title="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {categories.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Quick Actions
          </h4>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const uncategorizedCount = products.filter(
                  (p) => !p.category || p.category === ""
                ).length;
                if (uncategorizedCount > 0) {
                  showInfo(
                    `You have ${uncategorizedCount} product(s) without a category. Assign categories in the Products page.`
                  );
                } else {
                  showSuccess("All products have categories assigned!");
                }
              }}
              className="px-4 py-2 bg-[#2a2a2a] text-gray-300 rounded-lg border border-[#3a3a3a] hover:bg-[#3a3a3a] transition text-sm"
            >
              Check Uncategorized
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
