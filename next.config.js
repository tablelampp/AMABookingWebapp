/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack to handle the new folder structure
  webpack: (config, { isServer }) => {
    // Add aliases for easier imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@client': './client',
      '@server': './server',
    };
    return config;
  },
}

module.exports = nextConfig 