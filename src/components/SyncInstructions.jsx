const SyncInstructions = () => (
  <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
    <h2 className="text-lg font-semibold text-gray-100 mb-4">
      Sync Instructions
    </h2>
    <div className="space-y-3 text-sm text-gray-300">
      {[
        "Export data from your main device first",
        "Save the backup file in a secure location",
        "On another device, import the backup file you exported",
        "Repeat the process when you add new data",
      ].map((instruction, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <p>{instruction}</p>
        </div>
      ))}
    </div>
  </div>
);

export default SyncInstructions;
