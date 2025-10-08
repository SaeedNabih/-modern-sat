export const createSalesActions = (set, get) => ({
  addSale: (sale) => {
    const { products, getActiveDiscounts } = get();
    const activeDiscounts = getActiveDiscounts();
    const productDiscount = activeDiscounts.find(
      (d) => d.productId === sale.productId
    );

    const originalPrice = parseFloat(sale.price);
    let discountAmount = 0;
    let finalPrice = originalPrice;

    if (productDiscount) {
      if (productDiscount.type === "percentage") {
        discountAmount = (originalPrice * productDiscount.amount) / 100;
      } else {
        discountAmount = productDiscount.amount;
      }
      finalPrice = Math.max(0, originalPrice - discountAmount);
    }

    const finalTotal = (finalPrice * parseInt(sale.count)).toString();

    const updatedProducts = products.map((product) => {
      if (product.id === sale.productId) {
        return {
          ...product,
          stock: (parseInt(product.stock) - parseInt(sale.count)).toString(),
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
      discountId: productDiscount?.id || null,
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
});
