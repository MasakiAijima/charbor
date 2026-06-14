import type { NextConfig } from "next";
import path from "node:path";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/charbor" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
