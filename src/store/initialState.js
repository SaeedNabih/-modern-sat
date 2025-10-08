export const initialState = {
  products: [],
  sales: [],
  discounts: [],
  settings: {
    storeName: "Modern Sat",
    currency: "EGP",
    dateFormat: "dd/MM/yyyy",
    theme: "dark",
    notifications: {
      lowStock: true,
      newSales: true,
      discountExpiry: true,
      dailyReports: false,
    },
  },
  syncStatus: "idle", // 'idle', 'syncing', 'success', 'error'

  // إضافة حقول جديدة للتأكد من التوافق
  version: "2.0",
  lastUpdated: new Date().toISOString(),
};
