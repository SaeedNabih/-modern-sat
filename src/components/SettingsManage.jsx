"use client";
import DataSync from "@/components/DataSync/DataSync";
import RepoInfo from "@/components/RepoInfo";
import SyncInstructions from "@/components/SyncInstructions";
import AppInfo from "@/components/AppInfo";
import CategoryManager from "@/components/CategoryManager";

export default function SettingsManage() {
  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <Header />
      <RepoInfo />
      <CategoryManager />
      <DataSync />
      <SyncInstructions />
      <AppInfo />
    </div>
  );
}

const Header = () => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
      Settings & Configuration
    </h1>
    <p className="text-sm text-gray-500 mt-1">
      Manage your repository, settings, categories, and cloud synchronization
    </p>
  </div>
);
