"use client";
import { useStore } from "@/store/useStore";
import { useModal } from "@/hooks/useModal";
import { RefreshCw, Database } from "lucide-react";

export default function ResetStorage() {
  const { showConfirm, showSuccess } = useModal();

  const handleResetStorage = () => {
    showConfirm(
      "Are you sure you want to reset all storage data? This will clear all local data and you'll need to sync from cloud again.",
      () => {
        localStorage.removeItem("modern-sat-storage");
        window.location.reload();
      },
      "Reset Storage"
    );
  };

  const handleFixData = () => {
    showConfirm(
      "This will attempt to fix data structure issues. Continue?",
      () => {
        // إعادة تحميل الصفحة لتطبيق التصحيحات
        window.location.reload();
      },
      "Fix Data Structure"
    );
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Database size={24} className="text-orange-400" />
        <h2 className="text-lg font-semibold text-gray-100">
          Storage Management
        </h2>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleFixData}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors w-full"
        >
          <RefreshCw size={18} />
          Fix Data Structure
        </button>

        <button
          onClick={handleResetStorage}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full"
        >
          <RefreshCw size={18} />
          Reset Local Storage
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <p>• Use Fix Data Structure to resolve migration errors</p>
        <p>• Use Reset Local Storage as last resort</p>
        <p>• Make sure to sync to cloud first to avoid data loss</p>
      </div>
    </div>
  );
}
