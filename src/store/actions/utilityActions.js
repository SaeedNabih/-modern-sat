export const createUtilityActions = (set, get) => ({
  getStats: () => {
    const { products, sales } = get();
    const totalProducts = products.length;
    const totalSalesCount = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + parseFloat(sale.total),
      0
    );
    const totalDiscounts = sales.reduce(
      (sum, sale) => sum + parseFloat(sale.discount || 0),
      0
    );

    const totalProfit = sales.reduce((sum, sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (!product) return sum;
      const cost = parseFloat(product.cost || 0);
      const revenue = parseFloat(sale.total);
      const quantity = parseInt(sale.count);
      return sum + (revenue - cost * quantity);
    }, 0);

    return {
      totalProducts,
      totalSales: totalRevenue,
      totalSalesCount,
      totalProfit,
      totalDiscounts,
    };
  },

  exportData: () => {
    const state = get();
    return {
      products: state.products,
      sales: state.sales,
      discounts: state.discounts,
      settings: state.settings,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
  },

  importData: (data) => {
    if (!data.products || !data.sales || !data.discounts) {
      throw new Error("Invalid data format");
    }

    set({
      products: data.products || [],
      sales: data.sales || [],
      discounts: data.discounts || [],
      settings: data.settings || get().settings,
    });

    return true;
  },

  resetAll: () => set({ ...get().initialState }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
});
