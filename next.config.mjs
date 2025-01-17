/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    return config;
  },
  // Allow connections from local network
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  // Add hostname configuration
  hostname: '0.0.0.0',
  port: 3000,
};

export default nextConfig;
