"use client";
import { Menu, User } from "lucide-react";

export default function Navbar({
  onToggleSidebar,
  isSidebarCollapsed,
  offsetLeft,
}) {
  return (
    <header
      style={{ left: offsetLeft }}
      className="fixed top-0 right-0 z-30 h-16 bg-[#111111] border-b border-[#1f1f1f] flex items-center justify-between px-6 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-200 tracking-tight">
          Modern <span className="text-gray-400">Sat</span>
        </h1>
      </div>
      <div className="flex items-center gap-3 bg-[#1a1a1a] px-3 py-1.5 rounded-xl border border-[#2a2a2a]">
        <User className="text-gray-400" size={20} />
        <div className="flex flex-col leading-tight">
          <span className="text-sm text-gray-200 font-medium">Admin</span>
          <span className="text-xs text-gray-500">Said</span>
        </div>
      </div>
    </header>
  );
}
