"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import PrivateAccess from "@/components/PrivateAccess";
import DataMigrationFix from "./DataMigrationFix";

export default function LayoutClient({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-[Inter] flex">
      <PrivateAccess />
      <DataMigrationFix />

      <div
        className={`
        hidden md:block fixed top-0 left-0 h-screen bg-[#111111] border-r border-[#1f1f1f] 
        shadow-[4px_0_15px_rgba(0,0,0,0.6)] transition-all duration-300 z-30
        ${collapsed ? "w-20" : "w-64"}
      `}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* السيدبار للشاشات الصغيرة */}
      {isMobile && (
        <>
          {/* overlay عند فتح السيدبار في الجوال */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleCloseSidebar}
            />
          )}

          {/* السيدبار نفسه */}
          <div
            className={`
            fixed top-0 left-0 h-full w-64 bg-[#111111] border-r border-[#1f1f1f] 
            shadow-[4px_0_15px_rgba(0,0,0,0.6)] transition-transform duration-300 z-50
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <Sidebar
              collapsed={false}
              setCollapsed={setCollapsed}
              onClose={handleCloseSidebar}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* المحتوى الرئيسي */}
      <div
        className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300
        ${isMobile ? "ml-0" : collapsed ? "md:ml-20" : "md:ml-64"}
      `}
      >
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={collapsed}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />
        <main
          className={`
          flex-1 px-4 sm:px-6 py-6 bg-[#0a0a0a] overflow-y-auto mt-16
        `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
