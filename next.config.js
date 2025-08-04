/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.placeholder.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'truthhair.zw',
          },
        ],
        destination: 'https://www.instagram.com/truthhair.zw',
        permanent: false,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'truthhair.zw',
          },
        ],
        destination: 'https://www.instagram.com/truthhair.zw',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig