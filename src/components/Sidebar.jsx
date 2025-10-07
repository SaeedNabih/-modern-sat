"use client";
import Link from "next/link";
import {
  Home,
  BarChart2,
  Package,
  Warehouse,
  Tag,
  X,
  Menu,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Sales", icon: BarChart2, path: "/sales" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Discounts", icon: Tag, path: "/discounts" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#111111] border-r border-[#1f1f1f] shadow-[4px_0_15px_rgba(0,0,0,0.6)] transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#1f1f1f]">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-gray-300 tracking-tight">
            Modern Sat
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[#2a2a2a] transition"
        >
          {collapsed ? (
            <Menu size={20} className="text-gray-400" />
          ) : (
            <X size={20} className="text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2">
        {navItems.map(({ name, icon: Icon, path }) => {
          const active = pathname === path;
          return (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#2f2f2f] text-gray-100"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#1a1a1a]"
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span>{name}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
