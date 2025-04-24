/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["img.youtube.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
