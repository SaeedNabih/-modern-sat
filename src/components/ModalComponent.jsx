"use client";
import { useModalStore } from "@/store/modalStore";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function ModalComponent() {
  const {
    isOpen,
    title,
    message,
    type,
    confirmText,
    cancelText,
    showCancel,
    hideModal,
    confirmModal,
    cancelModal,
  } = useModalStore();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "confirm":
        return <AlertTriangle className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "confirm":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={hideModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          </div>
          <button
            onClick={hideModal}
            className="p-1 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-300 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-[#1a1a1a]">
          {showCancel && (
            <button
              onClick={cancelModal}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={confirmModal}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${getButtonColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
