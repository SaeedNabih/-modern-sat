"use client";
import { useEffect, useState } from "react";
import { Github, ExternalLink, CheckCircle, XCircle } from "lucide-react";

export default function RepoInfo() {
  const [repoInfo, setRepoInfo] = useState({});
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCurrentRepo = async () => {
      setIsChecking(true);

      const currentConfig = {
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER,
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO,
        tokenExists: !!process.env.NEXT_PUBLIC_GITHUB_TOKEN,
        tokenPreview: process.env.NEXT_PUBLIC_GITHUB_TOKEN
          ? "***" + process.env.NEXT_PUBLIC_GITHUB_TOKEN.slice(-4)
          : "Not set",
      };

      // اختبار الاتصال بالريبوزيتوري الحالي
      try {
        if (currentConfig.tokenExists) {
          const response = await fetch(
            `https://api.github.com/repos/${currentConfig.owner}/${currentConfig.repo}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              },
            }
          );

          currentConfig.repoExists = response.ok;
          currentConfig.repoStatus = response.status;
        }
      } catch (error) {
        currentConfig.repoExists = false;
        currentConfig.error = error.message;
      }

      setRepoInfo(currentConfig);
      setIsChecking(false);
    };

    checkCurrentRepo();
  }, []);

  const openGitHubProfile = () => {
    window.open(`https://github.com/${repoInfo.owner}`, "_blank");
  };

  const openGitHubRepos = () => {
    window.open(
      `https://github.com/${repoInfo.owner}?tab=repositories`,
      "_blank"
    );
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Github size={24} className="text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-100">
          Current Repository Info
        </h2>
      </div>

      {isChecking ? (
        <div className="text-gray-400 text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
          Checking repository configuration...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current Configuration */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <h3 className="text-gray-200 font-medium mb-3">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">GitHub Username</p>
                <p className="text-gray-200 font-medium">
                  {repoInfo.owner || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Repository Name</p>
                <p className="text-gray-200 font-medium">
                  {repoInfo.repo || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Token Status</p>
                <p
                  className={`font-medium ${
                    repoInfo.tokenExists ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {repoInfo.tokenExists ? "✓ Configured" : "✗ Not set"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Repository Status</p>
                <p
                  className={`font-medium ${
                    repoInfo.repoExists
                      ? "text-green-400"
                      : repoInfo.repoStatus === 404
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                >
                  {repoInfo.repoExists
                    ? "✓ Exists"
                    : repoInfo.repoStatus === 404
                    ? "❌ Not found"
                    : "⚠️ Check failed"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openGitHubProfile}
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex-1"
            >
              <ExternalLink size={16} />
              View My GitHub Profile
            </button>

            <button
              onClick={openGitHubRepos}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex-1"
            >
              <ExternalLink size={16} />
              View My Repositories
            </button>
          </div>

          {/* Recommendations */}
          {repoInfo.repoStatus === 404 && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">
                Repository Not Found
              </h4>
              <p className="text-orange-200 text-sm">
                The repository{" "}
                <strong>
                  {repoInfo.owner}/{repoInfo.repo}
                </strong>{" "}
                does not exist. You need to create it on GitHub.
              </p>
            </div>
          )}

          {!repoInfo.tokenExists && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-300 font-medium mb-2">
                Token Not Configured
              </h4>
              <p className="text-red-200 text-sm">
                GitHub token is not set. Check your .env.local file.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
