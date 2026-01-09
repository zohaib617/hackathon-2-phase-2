/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Ignore TypeScript build errors (deploy even if TS errors exist)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
