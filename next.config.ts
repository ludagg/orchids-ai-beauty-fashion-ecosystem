import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, "src/visual-edits/component-tagger-loader.js");

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true" || !!process.env.VERCEL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

// Only set outputFileTracingRoot outside of Vercel builds
if (!isVercel) {
  (nextConfig as any).outputFileTracingRoot = path.resolve(__dirname, "../../");
}

// ✅ Disable Turbopack on Vercel
if (!isVercel) {
  (nextConfig as any).turbopack = {
    rules: {
      "src/**/*.{jsx,tsx}": {
        loaders: [LOADER],
      },
    },
  };
}

export default nextConfig;