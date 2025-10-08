"use client";
import { useEffect } from "react";

export default function PrivateAccess() {
  useEffect(() => {
    // منع فتح الموقع في إطارات
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }

    // منع أخذ لقطات الشاشة (في المتصفحات المدعومة)
    if (CSS.supports("(-webkit-touch-callout: none)")) {
      document.body.style.webkitTouchCallout = "none";
      document.body.style.webkitUserSelect = "none";
    }

    // إضافة طبقة حماية ضد أدوات المطورين
    const devToolsOpened = () => {
      // يمكنك إضافة رد فعل هنا مثل إعادة التوجيه أو إظهار رسالة
      console.log("Developer tools detected - Private system");
    };

    // كشف فتح أدوات المطورين (طريقة بسيطة)
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        devToolsOpened();
      }
    };

    setInterval(checkDevTools, 1000);
  }, []);

  return null;
}
