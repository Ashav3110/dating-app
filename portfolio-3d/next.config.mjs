/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress Three.js canvas module warning
  webpack(config) {
    config.externals = config.externals || [];
    return config;
  },
  // Allow cross-origin images (for any external textures/assets)
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
