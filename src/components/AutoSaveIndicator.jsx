"use client";
import { useState, useEffect } from "react";

export default function AutoSaveIndicator({ isSaving, lastSaved }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isSaving) {
      setShow(true);
    } else {
      // إخفاء المؤشر بعد ثانيتين من الحفظ الناجح
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
        {isSaving ? (
          <>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Auto-saving...</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">
              Auto-saved{" "}
              {lastSaved
                ? new Date(lastSaved).toLocaleTimeString()
                : "just now"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
