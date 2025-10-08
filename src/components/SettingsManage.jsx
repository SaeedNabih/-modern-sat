import DataSync from "@/components/DataSync";

export default function SettingsManage() {
  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage data and application settings
        </p>
      </div>

      <DataSync />

      {/* Sync Instructions */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Sync Instructions
        </h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Export data from your main device first</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Save the backup file in a secure location</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>On another device, import the backup file you exported</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Repeat the process when you add new data</p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          App Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p>
              <strong>Name:</strong> Modern Sat
            </p>
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Storage:</strong> Local Browser
            </p>
          </div>
          <div>
            <p>
              <strong>Data Format:</strong> JSON
            </p>
            <p>
              <strong>Backup:</strong> Manual Export/Import
            </p>
            <p>
              <strong>Created By:</strong> Said Tolan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
