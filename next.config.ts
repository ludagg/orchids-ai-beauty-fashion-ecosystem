import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, "src/visual-edits/component-tagger-loader.js");

// Detect Vercel environment to avoid forcing outputFileTracingRoot there
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true" || !!process.env.VERCEL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // Keep default behavior on Vercel; only override outputFileTracingRoot when not on Vercel.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER],
      },
    },
  },
};

// Only set outputFileTracingRoot outside of Vercel builds to avoid duplicated /vercel/path0 paths
if (!isVercel) {
  (nextConfig as any).outputFileTracingRoot = path.resolve(__dirname, "../../");
}

export default nextConfig;