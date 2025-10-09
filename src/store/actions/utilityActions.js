import { githubService } from "@/services/githubService";

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
      categories: state.categories,
      settings: state.settings,
      exportedAt: new Date().toISOString(),
      version: "2.1",
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
      categories: data.categories || [
        "Electronics",
        "Clothing",
        "Books",
        "Home",
      ],
      settings: data.settings || get().settings,
    });

    return true;
  },

  resetAll: () => set({ ...initialState }),

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));

    // مزامنة تلقائية عند تغيير الإعدادات
    const state = get();
    if (state.settings.autoSync) {
      setTimeout(() => {
        get().syncToCloud().catch(console.error);
      }, 2000);
    }
  },

  // دوال المزامنة مع السحابة
  syncToCloud: async () => {
    set({ syncStatus: "syncing" });

    try {
      const connectionOk = await githubService.testConnection();
      if (!connectionOk) {
        throw new Error(
          "Cannot connect to GitHub. Check your token and repository."
        );
      }

      const state = get();
      const data = {
        products: state.products,
        sales: state.sales,
        discounts: state.discounts,
        categories: state.categories,
        settings: state.settings,
        lastSync: new Date().toISOString(),
        version: "2.1",
      };

      const success = await githubService.saveData(data);

      if (success) {
        set({
          syncStatus: "success",
          lastUpdated: new Date().toISOString(),
        });
        return true;
      } else {
        throw new Error("Failed to save data to cloud");
      }
    } catch (error) {
      set({ syncStatus: "error" });
      throw error;
    }
  },

  syncFromCloud: async () => {
    set({ syncStatus: "syncing" });

    try {
      const connectionOk = await githubService.testConnection();
      if (!connectionOk) {
        throw new Error(
          "Cannot connect to GitHub. Check your token and repository."
        );
      }

      const cloudData = await githubService.loadData();
      if (cloudData) {
        set({
          products: cloudData.products || [],
          sales: cloudData.sales || [],
          discounts: cloudData.discounts || [],
          categories: cloudData.categories || [
            "Electronics",
            "Clothing",
            "Books",
            "Home",
          ],
          settings: cloudData.settings || get().settings,
          syncStatus: "success",
          lastUpdated: new Date().toISOString(),
        });
        return true;
      } else {
        throw new Error("No data found in cloud repository");
      }
    } catch (error) {
      set({ syncStatus: "error" });
      throw error;
    }
  },

  clearSyncStatus: () => set({ syncStatus: "idle" }),

  // دوال إدارة الأصناف مع المزامنة التلقائية
  addCategory: (category) => {
    if (!category || !category.trim()) return;

    const trimmedCategory = category.trim();
    set((state) => {
      if (state.categories.includes(trimmedCategory)) {
        return state;
      }
      const updatedCategories = [...state.categories, trimmedCategory];

      // حفظ تلقائي بعد إضافة صنف إذا كان الإعداد مفعل
      if (state.settings.autoSync) {
        setTimeout(() => {
          get().syncToCloud().catch(console.error);
        }, 1000);
      }

      return {
        categories: updatedCategories,
      };
    });
  },

  deleteCategory: (category) => {
    set((state) => {
      const updatedCategories = state.categories.filter((c) => c !== category);

      // حفظ تلقائي بعد حذف صنف إذا كان الإعداد مفعل
      if (state.settings.autoSync) {
        setTimeout(() => {
          get().syncToCloud().catch(console.error);
        }, 1000);
      }

      return {
        categories: updatedCategories,
      };
    });
  },

  updateProductCategory: (productId, newCategory) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? { ...product, category: newCategory }
          : product
      ),
    }));

    // حفظ تلقائي بعد تحديث تصنيف المنتج إذا كان الإعداد مفعل
    const state = get();
    if (state.settings.autoSync) {
      setTimeout(() => {
        get().syncToCloud().catch(console.error);
      }, 1000);
    }
  },

  // دالة مساعدة للحصول على إحصائيات الأصناف
  getCategoryStats: () => {
    const { products, sales, categories } = get();

    const categoryStats = categories.map((category) => {
      const categoryProducts = products.filter((p) => p.category === category);
      const categorySales = sales.filter((s) => {
        const product = products.find((p) => p.id === s.productId);
        return product?.category === category;
      });

      const totalRevenue = categorySales.reduce(
        (sum, sale) => sum + parseFloat(sale.total),
        0
      );

      return {
        name: category,
        productCount: categoryProducts.length,
        salesCount: categorySales.length,
        totalRevenue: totalRevenue,
      };
    });

    // إضافة "غير مصنف"
    const uncategorizedProducts = products.filter(
      (p) => !p.category || p.category === ""
    );
    const uncategorizedSales = sales.filter((s) => {
      const product = products.find((p) => p.id === s.productId);
      return !product?.category || product.category === "";
    });

    const uncategorizedRevenue = uncategorizedSales.reduce(
      (sum, sale) => sum + parseFloat(sale.total),
      0
    );

    if (uncategorizedProducts.length > 0) {
      categoryStats.push({
        name: "Uncategorized",
        productCount: uncategorizedProducts.length,
        salesCount: uncategorizedSales.length,
        totalRevenue: uncategorizedRevenue,
      });
    }

    return categoryStats;
  },

  // دالة مساعدة لفحص صحة البيانات
  checkDataHealth: () => {
    const state = get();
    const issues = [];

    if (!state.products) issues.push("Missing products array");
    if (!state.sales) issues.push("Missing sales array");
    if (!state.discounts) issues.push("Missing discounts array");
    if (!state.categories) issues.push("Missing categories array");
    if (!state.syncStatus) issues.push("Missing syncStatus");

    return {
      healthy: issues.length === 0,
      issues,
      version: state.version || "unknown",
      categoriesCount: state.categories?.length || 0,
      productsCount: state.products?.length || 0,
      salesCount: state.sales?.length || 0,
      lastUpdated: state.lastUpdated || "unknown",
      autoSync: state.settings?.autoSync || false,
    };
  },

  // دالة جديدة للتحقق من اتصال GitHub
  testGitHubConnection: async () => {
    try {
      const connectionOk = await githubService.testConnection();
      return {
        success: connectionOk,
        message: connectionOk
          ? "Connected to GitHub successfully"
          : "Failed to connect to GitHub",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // دالة جديدة لإنشاء مستودع جديد
  createNewRepository: async (
    repoName,
    description = "",
    isPrivate = false
  ) => {
    try {
      const result = await githubService.createRepository(
        repoName,
        description,
        isPrivate
      );
      return {
        success: true,
        message: "Repository created successfully",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  getUserRepositories: async () => {
    try {
      const repos = await githubService.getUserRepos();
      return {
        success: true,
        data: repos,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
});
