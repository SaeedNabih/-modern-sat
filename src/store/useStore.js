"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  products: [],
  sales: [],
  discounts: [],
  settings: {
    storeName: "Modern Sat",
    currency: "EGP",
    language: "ar",
    dateFormat: "dd/MM/yyyy",
    theme: "dark",
    notifications: {
      lowStock: true,
      newSales: true,
      discountExpiry: true,
      dailyReports: false,
    },
  },
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),

      updateProduct: (updated) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === updated.id ? updated : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      resetProducts: () => set({ products: [] }),

      addSale: (sale) => {
        const { products, getActiveDiscounts } = get();

        const activeDiscounts = getActiveDiscounts();
        const productDiscount = activeDiscounts.find(
          (d) => d.product.toLowerCase() === sale.title.toLowerCase()
        );

        const originalPrice = parseFloat(sale.price);
        const discountAmount = productDiscount ? productDiscount.amount : 0;
        const finalPrice = Math.max(0, originalPrice - discountAmount);
        const finalTotal = (finalPrice * parseInt(sale.count)).toString();

        const updatedProducts = products.map((product) => {
          if (product.id === sale.productId) {
            return {
              ...product,
              stock: (
                parseInt(product.stock) - parseInt(sale.count)
              ).toString(),
            };
          }
          return product;
        });

        const saleWithDiscount = {
          ...sale,
          price: finalPrice.toString(),
          total: finalTotal,
          originalPrice: originalPrice.toString(),
          discount: discountAmount.toString(),
        };

        set((state) => ({
          sales: [saleWithDiscount, ...state.sales],
          products: updatedProducts,
        }));
      },

      deleteSale: (id) => {
        const { sales, products } = get();
        const saleToDelete = sales.find((s) => s.id === id);

        if (saleToDelete) {
          const updatedProducts = products.map((product) => {
            if (product.id === saleToDelete.productId) {
              return {
                ...product,
                stock: (
                  parseInt(product.stock) + parseInt(saleToDelete.count)
                ).toString(),
              };
            }
            return product;
          });

          set({
            sales: sales.filter((s) => s.id !== id),
            products: updatedProducts,
          });
        }
      },

      resetSales: () => set({ sales: [] }),

      addDiscount: (discount) =>
        set((state) => ({ discounts: [discount, ...state.discounts] })),

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

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      getActiveDiscounts: () => {
        const { discounts } = get();
        const today = new Date().toISOString().split("T")[0];
        return discounts.filter((d) => d.expires >= today);
      },

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
        };
      },

      importData: (data) => {
        set({
          products: data.products || [],
          sales: data.sales || [],
          discounts: data.discounts || [],
          settings: data.settings || get().settings,
        });
      },

      resetAll: () => set(initialState),
    }),
    {
      name: "modern-sat-storage",
    }
  )
);
