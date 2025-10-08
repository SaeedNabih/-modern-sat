import { Download, Upload } from "lucide-react";

const ActionButtons = ({ onExport, onImport, isImporting }) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-4">
    <button
      onClick={onExport}
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
        onChange={onImport}
        className="hidden"
        disabled={isImporting}
      />
    </label>
  </div>
);

export default ActionButtons;
