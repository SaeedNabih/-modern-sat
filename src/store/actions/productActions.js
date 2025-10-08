export const createProductActions = (set, get) => ({
  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
    })),

  updateProduct: (updated) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === updated.id ? updated : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  resetProducts: () => set({ products: [] }),
});
