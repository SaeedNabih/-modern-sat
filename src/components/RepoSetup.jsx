"use client";
import { useState } from "react";
import { Github, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { githubService } from "@/services/githubService";
import { useModal } from "@/hooks/useModal";

export default function RepoSetup() {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupStatus, setSetupStatus] = useState("");
  const { showSuccess, showError } = useModal();

  const handleCreateRepo = async () => {
    setIsSettingUp(true);
    setSetupStatus("Creating repository...");

    try {
      const success = await githubService.createRepository();

      if (success) {
        setSetupStatus("Repository created successfully!");
        showSuccess(
          "Repository created! You can now sync your data to the cloud."
        );

        // اختبار الاتصال بعد الإنشاء
        setTimeout(async () => {
          setSetupStatus("Testing connection...");
          const connected = await githubService.testConnection();
          if (connected) {
            setSetupStatus("Setup completed successfully! 🎉");
          } else {
            setSetupStatus("Repository created but connection test failed.");
          }
        }, 2000);
      } else {
        setSetupStatus("Failed to create repository.");
        showError("Failed to create repository. Please create it manually.");
      }
    } catch (error) {
      setSetupStatus("Error: " + error.message);
      showError("Setup failed: " + error.message);
    } finally {
      setIsSettingUp(false);
    }
  };

  const openGitHub = () => {
    window.open("https://github.com/new", "_blank");
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Github size={24} className="text-purple-400" />
        <h2 className="text-lg font-semibold text-gray-100">
          GitHub Repository Setup
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-gray-200 font-medium mb-2">
            Current Configuration
          </h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p>
              👤 Owner:{" "}
              <span className="text-gray-200">
                {process.env.NEXT_PUBLIC_GITHUB_OWNER}
              </span>
            </p>
            <p>
              📦 Repository:{" "}
              <span className="text-gray-200">
                {process.env.NEXT_PUBLIC_GITHUB_REPO}
              </span>
            </p>
            <p>
              🔑 Token:{" "}
              <span className="text-gray-200">
                {process.env.NEXT_PUBLIC_GITHUB_TOKEN
                  ? "***" + process.env.NEXT_PUBLIC_GITHUB_TOKEN.slice(-4)
                  : "Not set"}
              </span>
            </p>
          </div>
        </div>

        {setupStatus && (
          <div
            className={`p-3 rounded-lg ${
              setupStatus.includes("✅") || setupStatus.includes("success")
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : setupStatus.includes("❌") || setupStatus.includes("Failed")
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}
          >
            {setupStatus}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCreateRepo}
            disabled={isSettingUp}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex-1 disabled:opacity-50"
          >
            {isSettingUp ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircle size={18} />
            )}
            {isSettingUp ? "Creating..." : "Auto-Create Repository"}
          </button>

          <button
            onClick={openGitHub}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex-1"
          >
            <ExternalLink size={18} />
            Create Manually
          </button>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>• Auto-create: Attempts to create repository automatically</p>
          <p>• Manual: Create repository on GitHub website</p>
          <p>
            • Repository name must match:{" "}
            <strong>{process.env.NEXT_PUBLIC_GITHUB_REPO}</strong>
          </p>
          <p>
            • Make sure the repository is <strong>Public</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
