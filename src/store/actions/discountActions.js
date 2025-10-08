export const createDiscountActions = (set, get) => ({
  addDiscount: (discount) =>
    set((state) => ({
      discounts: [discount, ...state.discounts],
    })),

  updateDiscount: (updated) =>
    set((state) => ({
      discounts: state.discounts.map((d) =>
        d.id === updated.id ? updated : d
      ),
    })),

  deleteDiscount: (id) =>
    set((state) => ({
      discounts: state.discounts.filter((d) => d.id !== id),
    })),

  resetDiscounts: () => set({ discounts: [] }),

  getActiveDiscounts: () => {
    const { discounts } = get();
    const today = new Date().toISOString().split("T")[0];
    return discounts.filter((d) => d.expires >= today && d.isActive);
  },

  getProductDiscount: (productId) => {
    const activeDiscounts = get().getActiveDiscounts();
    return activeDiscounts.find((d) => d.productId === productId);
  },
});
