/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['financialmodelingprep.com', 'images.unsplash.com', 'img.clerk.com', 'images.clerk.dev']
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
}

export default nextConfig