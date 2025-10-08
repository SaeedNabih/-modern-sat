const RecentSales = ({ sales }) => {
  const recentSales = sales.slice(0, 5);

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Recent Sales</h2>
      {recentSales.length > 0 ? (
        <div className="space-y-3">
          {recentSales.map((sale) => (
            <SaleItem key={sale.id} sale={sale} />
          ))}
        </div>
      ) : (
        <EmptyState message="No sales recorded yet." />
      )}
    </div>
  );
};

const SaleItem = ({ sale }) => (
  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
    <div>
      <p className="text-gray-100 font-medium">{sale.title}</p>
      <p className="text-gray-400 text-sm">{sale.date}</p>
    </div>
    <div className="text-right">
      <p className="text-gray-100 font-semibold">{sale.total} EGP</p>
      <p className="text-gray-400 text-sm">Qty: {sale.count}</p>
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-gray-500 text-sm text-center py-6">{message}</div>
);

export default RecentSales;
