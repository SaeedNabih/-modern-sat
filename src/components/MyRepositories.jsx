"use client";
import { useEffect, useState } from "react";
import { Github, Star, Eye, CheckCircle } from "lucide-react";

export default function MyRepositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;

        if (!token || !owner) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.github.com/users/${owner}/repos?sort=updated&per_page=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const repoData = await response.json();
          setRepos(repoData);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const openRepo = (repoName) => {
    window.open(
      `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${repoName}`,
      "_blank"
    );
  };

  if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
    return (
      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
        <div className="text-center text-gray-400">
          GitHub token not configured
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Github size={24} className="text-green-400" />
        <h2 className="text-lg font-semibold text-gray-100">
          My GitHub Repositories
        </h2>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
          Loading repositories...
        </div>
      ) : repos.length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          No repositories found or unable to fetch
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222222] transition-colors cursor-pointer"
              onClick={() => openRepo(repo.name)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-100 font-medium">{repo.name}</span>
                  {repo.name === process.env.NEXT_PUBLIC_GITHUB_REPO && (
                    <CheckCircle size={14} className="text-green-400" />
                  )}
                </div>
                <p className="text-gray-400 text-sm truncate">
                  {repo.description || "No description"}
                </p>
              </div>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} />
                  {repo.stargazers_count}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  {repo.watchers_count}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        <p>• Click on any repository to open it on GitHub</p>
        <p>
          • <CheckCircle size={12} className="inline text-green-400" />{" "}
          indicates current configured repository
        </p>
      </div>
    </div>
  );
}
