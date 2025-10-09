"use client";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const REPO_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const REPO_NAME = process.env.NEXT_PUBLIC_GITHUB_REPO;
const FILE_PATH = "data/store-data.json";

class GitHubService {
  constructor() {
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      console.warn("GitHub environment variables are not set properly");
    }

    // إعداد Auto Save
    this.autoSave = {
      timeoutId: null,

      schedule: function (callback, delay) {
        this.cancel();
        this.timeoutId = setTimeout(callback, delay);
      },

      cancel: function () {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
      },
    };
  }

  // الدوال الأساسية
  async saveData(data) {
    try {
      if (!GITHUB_TOKEN) {
        throw new Error("GitHub token is not configured");
      }

      const content = btoa(
        unescape(encodeURIComponent(JSON.stringify(data, null, 2)))
      );
      const message = `Update store data - ${new Date().toISOString()}`;

      const existingFile = await this.getFileSha();

      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message,
            content,
            sha: existingFile?.sha,
            branch: "main",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `GitHub API error: ${response.status}`
        );
      }

      console.log("✅ Data saved successfully to GitHub");
      return true;
    } catch (error) {
      console.error("❌ Error saving data to GitHub:", error);
      return false;
    }
  }

  async loadData() {
    try {
      if (!GITHUB_TOKEN) {
        throw new Error("GitHub token is not configured");
      }

      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.status === 404) {
        console.log("📝 No existing data found on GitHub - starting fresh");
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
      }

      const fileData = await response.json();
      const content = decodeURIComponent(escape(atob(fileData.content)));
      const parsedData = JSON.parse(content);

      console.log("✅ Data loaded successfully from GitHub");
      return parsedData;
    } catch (error) {
      console.error("❌ Error loading data from GitHub:", error);
      return null;
    }
  }

  async getFileSha() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async testConnection() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // الدوال الجديدة
  async createRepository(repoName, description = "", isPrivate = false) {
    try {
      // التحقق من أن repoName غير فارغ
      if (!repoName || repoName.trim() === "") {
        throw new Error("Repository name cannot be blank");
      }

      if (!GITHUB_TOKEN) {
        throw new Error("GitHub token is not configured");
      }

      const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          name: repoName.trim(),
          description: description,
          private: isPrivate,
          auto_init: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create repository: ${response.status}`
        );
      }

      console.log("✅ Repository created successfully");
      return await response.json();
    } catch (error) {
      console.error("❌ Error creating repository:", error);
      throw error;
    }
  }

  async getUserRepos() {
    try {
      if (!GITHUB_TOKEN) {
        throw new Error("GitHub token is not configured");
      }

      const response = await fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get repositories: ${response.status}`);
      }

      const repos = await response.json();
      const filteredRepos = repos.filter((repo) => !repo.name.startsWith("-"));

      return filteredRepos;
    } catch (error) {
      console.error("❌ Error getting user repositories:", error);
      return [];
    }
  }

  async getRepoContent(path = "") {
    try {
      if (!GITHUB_TOKEN) {
        throw new Error("GitHub token is not configured");
      }

      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get content: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error getting repository content:", error);
      return null;
    }
  }

  // دالة مساعدة للتحقق من صحة الاسم
  validateRepoName(repoName) {
    if (!repoName || repoName.trim() === "") {
      return { isValid: false, message: "Repository name cannot be blank" };
    }

    if (repoName.length > 100) {
      return { isValid: false, message: "Repository name too long" };
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(repoName)) {
      return {
        isValid: false,
        message: "Repository name contains invalid characters",
      };
    }

    return { isValid: true, message: "Valid repository name" };
  }
}

export const githubService = new GitHubService();
