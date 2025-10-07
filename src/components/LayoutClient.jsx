"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function LayoutClient({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const offsetLeft = collapsed ? "5rem" : "16rem";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-[Inter] flex overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          isSidebarCollapsed={collapsed}
          offsetLeft={offsetLeft}
        />
        <main className="flex-1 px-8 py-6 bg-[#0a0a0a] overflow-y-auto mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
  