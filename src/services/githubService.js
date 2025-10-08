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
  }

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
}

export const githubService = new GitHubService();
