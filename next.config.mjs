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
      '@mongodb-js/zstd-linux-x64-gnu',
      '@mongodb-js/zstd-linux-x64-musl',
      '@napi-rs/snappy-linux-x64-gnu',
      '@napi-rs/snappy-linux-x64-musl',
      'snappy',
      'kerberos',
      'mongodb-client-encryption',
      'gcp-metadata',
      '@aws-sdk/credential-providers',
      'socks',
      'bcryptjs',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Completely exclude MongoDB and related native modules from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        mongodb: 'commonjs mongodb',
        mongoose: 'commonjs mongoose',
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
        kerberos: 'commonjs kerberos',
        snappy: 'commonjs snappy',
      });

      // Set fallback to false for all MongoDB related packages
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongodb: false,
        mongoose: false,
        'mongodb-client-encryption': false,
        '@mongodb-js/zstd': false,
        '@mongodb-js/zstd-linux-x64-gnu': false,
        '@mongodb-js/zstd-linux-x64-musl': false,
        '@napi-rs/snappy-linux-x64-gnu': false,
        '@napi-rs/snappy-linux-x64-musl': false,
        snappy: false,
        kerberos: false,
        '@aws-sdk/credential-providers': false,
        'gcp-metadata': false,
        socks: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };

      // Ignore .node files completely in client builds
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.node$/,
        use: 'null-loader',
      });
    }
    return config;
  },
}

export default nextConfig
