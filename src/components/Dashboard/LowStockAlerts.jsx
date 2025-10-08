const LowStockAlerts = ({ products }) => {
  const lowStockProducts = products.filter((p) => parseInt(p.stock) < 5);

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Low Stock Alert
      </h2>
      {lowStockProducts.length > 0 ? (
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <LowStockItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState message="All products have sufficient stock." />
      )}
    </div>
  );
};

const LowStockItem = ({ product }) => (
  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border-l-4 border-red-500">
    <div>
      <p className="text-gray-100 font-medium">{product.title}</p>
      <p className="text-gray-400 text-sm">{product.category}</p>
    </div>
    <div className="text-red-400 font-semibold">{product.stock} left</div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-gray-500 text-sm text-center py-6">{message}</div>
);

export default LowStockAlerts;
