/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static export for Vercel
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Image optimization
  images: {
    unoptimized: true
  },
  
  // Environment variables
  env: {
    OPENCLAW_API_URL: process.env.OPENCLAW_API_URL,
    DASHBOARD_TITLE: process.env.NEXT_PUBLIC_DASHBOARD_TITLE,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig