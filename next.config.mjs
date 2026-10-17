/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {},
  // Support standalone build for Docker container deployment
  output: process.env.NEXT_OUTPUT_STANDALONE === 'true' ? 'standalone' : undefined,
  async rewrites() {
    return [
      {
        source: '/api/v1/webhooks/paypal:suffix(\\).|\\)|%29\\.|%29)',
        destination: '/api/v1/webhooks/paypal',
      },
    ];
  },
};

export default nextConfig;
