import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, "src/visual-edits/component-tagger-loader.js");

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true" || !!process.env.VERCEL;
const isProduction = process.env.NODE_ENV === 'production';

// Content Security Policy
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://slelguoygbfzlpylpxfs.supabase.co https://checkout.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https: http:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co https://api.stripe.com https://checkout.stripe.com wss://*.supabase.co;
  frame-src 'self' https://checkout.stripe.com https://js.stripe.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    const headers = [
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
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self), payment=(self)',
      },
    ];

    // Add CSP in production only
    if (isProduction) {
      headers.push({
        key: 'Content-Security-Policy',
        value: cspHeader,
      });
    }

    return [
      {
        source: '/(.*)',
        headers,
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
};

// Only set outputFileTracingRoot outside of Vercel builds
if (!isVercel) {
  (nextConfig as Record<string, unknown>).outputFileTracingRoot = path.resolve(__dirname, "../../");
}

// Disable Turbopack on Vercel
if (!isVercel) {
  (nextConfig as Record<string, unknown>).turbopack = {
    rules: {
      "src/**/*.{jsx,tsx}": {
        loaders: [LOADER],
      },
    },
  };
}

export default nextConfig;
