import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' },
      { protocol: 'https', hostname: 'img.example.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  }
};

export default nextConfig;
