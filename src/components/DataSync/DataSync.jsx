"use client";
import { useState, useEffect } from "react";
import {
  Download,
  Upload,
  Database,
  RefreshCw,
  Cloud,
  CloudOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useModal } from "@/hooks/useModal";
import DataStats from "./DataStats";
import ActionButtons from "./ActionButtons";
import ResetSection from "./ResetSection";
import Instructions from "./Instructions";

export default function DataSync() {
  const {
    exportData,
    importData,
    products,
    sales,
    discounts,
    resetAll,
    syncToCloud,
    syncFromCloud,
    syncStatus,
    clearSyncStatus,
  } = useStore();

  const { showSuccess, showError, showConfirm } = useModal();
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (syncStatus === "success") {
      setTimeout(() => clearSyncStatus(), 3000);
    }
  }, [syncStatus, clearSyncStatus]);

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

  const handleSyncToCloud = async () => {
    try {
      await syncToCloud();
      showSuccess(
        "Data synced to cloud successfully! You can now access it from any device."
      );
    } catch (error) {
      showError("Cloud sync failed: " + error.message);
    }
  };

  const handleSyncFromCloud = async () => {
    try {
      await syncFromCloud();
      showSuccess("Data loaded from cloud successfully!");
    } catch (error) {
      showError("Failed to load from cloud: " + error.message);
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw size={18} className="animate-spin" />;
      case "success":
        return <CheckCircle size={18} className="text-green-400" />;
      case "error":
        return <XCircle size={18} className="text-red-400" />;
      default:
        return <Cloud size={18} />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Syncing...";
      case "success":
        return "Sync Successful!";
      case "error":
        return "Sync Failed";
      default:
        return "Save to Cloud";
    }
  };

  const stats = {
    products: products.length,
    sales: sales.length,
    discounts: discounts.length,
    lastUpdate: new Date().toLocaleDateString("en-US"),
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
      <Header />
      <DataStats stats={stats} />

      {/* Cloud Sync Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={handleSyncToCloud}
          disabled={syncStatus === "syncing"}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex-1 disabled:opacity-50"
        >
          {getSyncStatusIcon()}
          {getSyncStatusText()}
        </button>

        <button
          onClick={handleSyncFromCloud}
          disabled={syncStatus === "syncing"}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex-1 disabled:opacity-50"
        >
          <CloudOff size={18} />
          {syncStatus === "syncing" ? "Loading..." : "Load from Cloud"}
        </button>
      </div>

      <ActionButtons
        onExport={handleExport}
        onImport={handleImport}
        isImporting={isImporting}
      />
      <ResetSection onReset={handleResetAll} isResetting={isResetting} />
      <Instructions />
    </div>
  );
}

const Header = () => (
  <div className="flex items-center gap-3 mb-4">
    <Database size={24} className="text-blue-400" />
    <h2 className="text-lg font-semibold text-gray-100">Data Management</h2>
  </div>
);
