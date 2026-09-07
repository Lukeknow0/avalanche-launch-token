import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBasePath = process.env.GITHUB_ACTIONS === "true" && repositoryName ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
  },
};

const isStaticExport = process.env.NEXT_PUBLIC_IPFS_BUILD === "true" || githubPagesBasePath !== "";

if (isStaticExport) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images = {
    unoptimized: true,
  };
}

if (githubPagesBasePath) {
  nextConfig.basePath = githubPagesBasePath;
  nextConfig.assetPrefix = githubPagesBasePath;
}

module.exports = nextConfig;
