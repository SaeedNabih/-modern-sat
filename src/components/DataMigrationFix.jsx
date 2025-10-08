"use client";
import { useEffect } from "react";

export default function DataMigrationFix() {
  useEffect(() => {
    // حل مشكلة ترحيل البيانات
    const fixMigrationIssue = () => {
      try {
        const storageKey = "modern-sat-storage";
        const stored = localStorage.getItem(storageKey);

        if (stored) {
          const parsed = JSON.parse(stored);

          // إذا كانت البيانات من الإصدار القديم
          if (parsed && parsed.state) {
            // تأكد من وجود جميع الحقول المطلوبة
            const fixedState = {
              ...parsed.state,
              syncStatus: parsed.state.syncStatus || "idle",
              products: parsed.state.products || [],
              sales: parsed.state.sales || [],
              discounts: parsed.state.discounts || [],
              settings: parsed.state.settings || {
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
            };

            // تحديث البيانات مع الإصدار الجديد
            const updatedStorage = {
              ...parsed,
              state: fixedState,
              version: 2,
            };

            localStorage.setItem(storageKey, JSON.stringify(updatedStorage));
            console.log("✅ Data migration fix applied successfully");
          }
        }
      } catch (error) {
        console.warn("❌ Migration fix failed:", error);

        try {
          localStorage.removeItem("modern-sat-storage");
          console.log("🔄 Storage reset due to migration failure");
        } catch (resetError) {
          console.error("❌ Failed to reset storage:", resetError);
        }
      }
    };

    setTimeout(fixMigrationIssue, 100);
  }, []);

  return null;
}
