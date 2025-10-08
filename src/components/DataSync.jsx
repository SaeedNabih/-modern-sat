"use client";
import { useState } from "react";
import { Download, Upload, Database, RefreshCw } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useModal } from "@/hooks/useModal";

export default function DataSync() {
  const { exportData, importData, products, sales, discounts, resetAll } =
    useStore();
  const { showSuccess, showError, showConfirm } = useModal();
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExport = () => {
    try {
      const data = exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `modern-sat-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccess(
        "Data exported successfully! You can now transfer this file to another device."
      );
    } catch (error) {
      showError("Export failed: " + error.message);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const success = importData(data);
        if (success) {
          showSuccess(
            "Data imported successfully! All your products, sales, and discounts have been loaded."
          );
        }
      } catch (error) {
        showError("Import failed: " + error.message);
      } finally {
        setIsImporting(false);
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      showError(
        "Error reading the file. Please make sure it's a valid backup file."
      );
      setIsImporting(false);
      event.target.value = "";
    };

    reader.readAsText(file);
  };

  const handleResetAll = () => {
    showConfirm(
      "Are you sure you want to reset all data? This will permanently delete all products, sales, and discounts. This action cannot be undone!",
      () => {
        setIsResetting(true);
        setTimeout(() => {
          resetAll();
          setIsResetting(false);
          showSuccess("All data has been reset successfully.");
        }, 1000);
      },
      "Reset All Data"
    );
  };

  const getStats = () => {
    return {
      products: products.length,
      sales: sales.length,
      discounts: discounts.length,
      lastUpdate: new Date().toLocaleDateString("en-US"),
    };
  };

  const stats = getStats();

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database size={24} className="text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-100">Data Management</h2>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-100">
            {stats.products}
          </div>
          <div className="text-xs text-gray-400">Products</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-100">{stats.sales}</div>
          <div className="text-xs text-gray-400">Sales</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-100">
            {stats.discounts}
          </div>
          <div className="text-xs text-gray-400">Discounts</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center">
          <div className="text-sm font-medium text-gray-100">
            {stats.lastUpdate}
          </div>
          <div className="text-xs text-gray-400">Last Update</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex-1"
        >
          <Download size={18} />
          Export Data
        </button>

        <label className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex-1">
          <Upload size={18} />
          {isImporting ? "Importing..." : "Import Data"}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            disabled={isImporting}
          />
        </label>
      </div>

      {/* Reset Button */}
      <div className="border-t border-[#2a2a2a] pt-4">
        <button
          onClick={handleResetAll}
          disabled={isResetting}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full disabled:opacity-50"
        >
          <RefreshCw size={18} className={isResetting ? "animate-spin" : ""} />
          {isResetting ? "Resetting..." : "Reset All Data"}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <p>• Export data to create a backup file</p>
        <p>• Import data to transfer to another device</p>
        <p>• Reset will delete all data permanently</p>
      </div>
    </div>
  );
}
