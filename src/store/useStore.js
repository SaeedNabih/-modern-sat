"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { githubService } from "@/services/githubService";
import { initialState } from "./initialState";
import { createProductActions } from "./actions/productActions";
import { createSalesActions } from "./actions/salesActions";
import { createDiscountActions } from "./actions/discountActions";
import { createUtilityActions } from "./actions/utilityActions";

// دالة ترحيل محسنة
const migrateData = (persistedState, version) => {
  if (!persistedState) return initialState;

  console.log("🔄 Migrating data from version:", version);

  // تأكد من وجود جميع الحقول الأساسية
  const migratedState = {
    ...initialState,
    ...persistedState,
    products: persistedState.products || initialState.products,
    sales: persistedState.sales || initialState.sales,
    discounts: persistedState.discounts || initialState.discounts,
    settings: {
      ...initialState.settings,
      ...(persistedState.settings || {}),
    },
    syncStatus: persistedState.syncStatus || "idle",
  };

  console.log("✅ Data migration completed");
  return migratedState;
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      ...createProductActions(set, get),
      ...createSalesActions(set, get),
      ...createDiscountActions(set, get),
      ...createUtilityActions(set, get),

      // GitHub Sync Functions
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
            settings: state.settings,
            lastSync: new Date().toISOString(),
            version: "2.0",
          };

          const success = await githubService.saveData(data);

          if (success) {
            set({ syncStatus: "success" });
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
              settings: cloudData.settings || get().settings,
              syncStatus: "success",
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

      // دالة مساعدة لفحص البيانات
      checkDataHealth: () => {
        const state = get();
        const issues = [];

        if (!state.products) issues.push("Missing products array");
        if (!state.sales) issues.push("Missing sales array");
        if (!state.discounts) issues.push("Missing discounts array");
        if (!state.syncStatus) issues.push("Missing syncStatus");

        return {
          healthy: issues.length === 0,
          issues,
          version: state.version || "unknown",
        };
      },
    }),
    {
      name: "modern-sat-storage",
      version: 2,
      migrate: migrateData,
      // إضافة صحّة التخزين
      onRehydrateStorage: () => (state) => {
        console.log("💾 Storage rehydrated:", state ? "success" : "failed");
      },
    }
  )
);
