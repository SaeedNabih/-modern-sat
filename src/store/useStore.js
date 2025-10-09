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

  const migratedState = {
    ...initialState,
    ...persistedState,
    products: persistedState.products || initialState.products,
    sales: persistedState.sales || initialState.sales,
    discounts: persistedState.discounts || initialState.discounts,
    categories: persistedState.categories || initialState.categories,
    settings: {
      ...initialState.settings,
      ...(persistedState.settings || {}),
      autoSync:
        persistedState.settings?.autoSync ?? initialState.settings.autoSync,
      syncInterval:
        persistedState.settings?.syncInterval ??
        initialState.settings.syncInterval,
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
    }),
    {
      name: "modern-sat-storage",
      version: 3,
      migrate: migrateData,
      onRehydrateStorage: () => (state) => {
        console.log("💾 Storage rehydrated:", state ? "success" : "failed");
        if (state) {
          console.log("📊 Data summary:", {
            products: state.products?.length || 0,
            sales: state.sales?.length || 0,
            discounts: state.discounts?.length || 0,
            categories: state.categories?.length || 0,
            version: state.version || "unknown",
            autoSync: state.settings?.autoSync || false,
          });
        }
      },
    }
  )
);
