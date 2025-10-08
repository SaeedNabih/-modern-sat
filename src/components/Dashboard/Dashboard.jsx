"use client";
import React from "react";
import { useStore } from "@/store/useStore";
import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StatsGrid";
import RecentSales from "./RecentSales";
import LowStockAlerts from "./LowStockAlerts";

const Dashboard = () => {
  const { products, sales, getStats } = useStore();
  const stats = getStats();

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />
      <StatsGrid stats={stats} salesCount={sales.length} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSales sales={sales} />
        <LowStockAlerts products={products} />
      </div>
    </div>
  );
};

export default Dashboard;
