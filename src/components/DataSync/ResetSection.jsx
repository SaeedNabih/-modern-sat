import { RefreshCw } from "lucide-react";

const ResetSection = ({ onReset, isResetting }) => (
  <div className="border-t border-[#2a2a2a] pt-4">
    <button
      onClick={onReset}
      disabled={isResetting}
      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full disabled:opacity-50"
    >
      <RefreshCw size={18} className={isResetting ? "animate-spin" : ""} />
      {isResetting ? "Resetting..." : "Reset All Data"}
    </button>
  </div>
);

export default ResetSection;
