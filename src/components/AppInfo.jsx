const AppInfo = () => {
  const info = {
    name: "Modern Sat",
    version: "1.0.0",
    storage: "Local Browser + GitHub Cloud",
    format: "JSON",
    backup: "Auto & Manual Sync",
    creator: "Saeed Tolan",
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        App Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
        <InfoSection
          items={[
            { label: "Name", value: info.name },
            { label: "Version", value: info.version },
            { label: "Storage", value: info.storage },
          ]}
        />
        <InfoSection
          items={[
            { label: "Data Format", value: info.format },
            { label: "Backup", value: info.backup },
            { label: "Created By", value: info.creator },
          ]}
        />
      </div>
    </div>
  );
};

const InfoSection = ({ items }) => (
  <div>
    {items.map((item, index) => (
      <p key={index}>
        <strong>{item.label}:</strong> {item.value}
      </p>
    ))}
  </div>
);

export default AppInfo;
