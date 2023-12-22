/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  skipWaiting: true,
  register: true
})

const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  swcMinify: true,
  compiler: {
    styledComponents: true
  }
}

module.exports = withPWA(nextConfig)