/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [
      'mongodb',
      'mongoose',
      '@mongodb-js/zstd',
      'snappy',
      'kerberos',
      'mongodb-client-encryption',
      'gcp-metadata',
      '@aws-sdk/credential-providers',
      'socks',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve these modules on client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongodb: false,
        mongoose: false,
        'mongodb-client-encryption': false,
        '@mongodb-js/zstd': false,
        snappy: false,
        kerberos: false,
      };
    }
    return config;
  },
}

export default nextConfig
