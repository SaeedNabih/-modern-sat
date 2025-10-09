"use client";
import { useState, useEffect, useCallback } from "react";
import { githubService } from "@/services/githubService";

export default function DataManage() {
  const [data, setData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [changesMade, setChangesMade] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل البيانات الأولي
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const savedData = await githubService.loadData();
      if (savedData) {
        setData(savedData);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto Save عند تغيير البيانات
  const handleDataChange = useCallback(
    (newData) => {
      setData(newData);
      setChangesMade(true);

      if (autoSaveEnabled && githubService.testConnection()) {
        setIsSaving(true);

        // جدولة حفظ تلقائي بعد 2 ثانية
        githubService.autoSave.schedule(async () => {
          try {
            await githubService.saveData(newData);
            setLastSaved(new Date());
            setChangesMade(false);
            console.log("✅ Auto-saved successfully");
          } catch (error) {
            console.error("❌ Auto-save failed:", error);
          } finally {
            setIsSaving(false);
          }
        }, 2000);
      }
    },
    [autoSaveEnabled]
  );

  // أمثلة على دوال تعديل البيانات
  const addNewItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: `Product ${Object.keys(data).length + 1}`,
      price: Math.floor(Math.random() * 1000) + 100,
      category: "Electronics",
      description: "New product description",
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newData = {
      ...data,
      [newItem.id]: newItem,
    };

    handleDataChange(newData);
  };

  const updateItem = (id, updates) => {
    const newData = {
      ...data,
      [id]: {
        ...data[id],
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    };

    handleDataChange(newData);
  };

  const deleteItem = (id) => {
    const newData = { ...data };
    delete newData[id];
    handleDataChange(newData);
  };

  // حفظ يدوي
  const handleManualSave = async () => {
    githubService.autoSave.cancel();

    setIsSaving(true);
    try {
      await githubService.saveData(data);
      setLastSaved(new Date());
      setChangesMade(false);
      console.log("✅ Manual save successful");
    } catch (error) {
      console.error("❌ Manual save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // تنظيف الـ timeout عند إلغاء التثبيت
  useEffect(() => {
    return () => {
      githubService.autoSave.cancel();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Data Management
          </h1>
          <p className="text-gray-400">
            Manage your store data with auto-save feature
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isSaving
                  ? "bg-yellow-500 animate-pulse"
                  : changesMade
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            ></div>
            <span className="text-sm text-gray-300">
              {isSaving
                ? "Saving..."
                : changesMade
                ? "Unsaved changes"
                : "All changes saved"}
            </span>
          </div>

          {/* Auto Save Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="autoSave" className="ml-2 text-sm text-gray-300">
              Auto Save
            </label>
          </div>

          {/* Manual Save Button */}
          <button
            onClick={handleManualSave}
            disabled={isSaving || !changesMade}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-md text-white font-medium transition-colors"
          >
            {isSaving ? "Saving..." : "Save Now"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">
            {Object.keys(data).length}
          </div>
          <div className="text-gray-400 text-sm">Total Items</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">
            {lastSaved ? new Date(lastSaved).toLocaleTimeString() : "Never"}
          </div>
          <div className="text-gray-400 text-sm">Last Saved</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">
            {autoSaveEnabled ? "On" : "Off"}
          </div>
          <div className="text-gray-400 text-sm">Auto Save</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">
            {changesMade ? "Yes" : "No"}
          </div>
          <div className="text-gray-400 text-sm">Unsaved Changes</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={addNewItem}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white font-medium transition-colors"
        >
          + Add New Item
        </button>

        <button
          onClick={loadInitialData}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white font-medium transition-colors"
        >
          ↻ Reload Data
        </button>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(data).map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-white font-medium text-lg">{item.name}</h3>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Delete
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-2">{item.description}</p>

            <div className="flex justify-between items-center mb-3">
              <span className="text-green-400 font-semibold">
                ${item.price}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  item.inStock
                    ? "bg-green-900 text-green-300"
                    : "bg-red-900 text-red-300"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Category: {item.category}</div>
              <div>
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </div>
              <div>
                Updated: {new Date(item.updatedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  updateItem(item.id, {
                    name: `${item.name} (Updated)`,
                    price: item.price + 10,
                    updatedAt: new Date().toISOString(),
                  })
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm transition-colors"
              >
                Update
              </button>
              <button
                onClick={() =>
                  updateItem(item.id, {
                    inStock: !item.inStock,
                    updatedAt: new Date().toISOString(),
                  })
                }
                className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-white text-sm transition-colors"
              >
                {item.inStock ? "Out of Stock" : "In Stock"}
              </button>
            </div>
          </div>
        ))}

        {Object.keys(data).length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No data yet</div>
            <button
              onClick={addNewItem}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium transition-colors"
            >
              Create First Item
            </button>
          </div>
        )}
      </div>

      {/* Auto Save Status Indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Auto-saving...</span>
          </div>
        </div>
      )}
    </div>
  );
}
