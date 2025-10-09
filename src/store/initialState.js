export const initialState = {
  products: [],
  sales: [],
  discounts: [],
  categories: ["Electronics", "Clothing", "Books", "Home"],
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
    autoSync: true, // إضافة إعداد المزامنة التلقائية
    syncInterval: 30000, // كل 30 ثانية
  },
  syncStatus: "idle",
  version: "2.1",
  lastUpdated: new Date().toISOString(),
};
