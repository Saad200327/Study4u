/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist']
  },
  webpack: (config) => {
    // Prevent webpack from trying to bundle canvas (optional pdfjs dep)
    config.resolve.alias.canvas = false;
    return config;
  }
};

export default nextConfig;
