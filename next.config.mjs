/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/menu/:path*",
        destination: "https://pizzahub-server-mu.vercel.app/api/menu/:path*",
      },
      {
        source: "/api/orders/:path*",
        destination: "https://pizzahub-server-mu.vercel.app/api/orders/:path*",
      },
      {
        source: "/api/payments/:path*",
        destination: "https://pizzahub-server-mu.vercel.app/api/payments/:path*",
      },
      {
        source: "/api/dashboard/:path*",
        destination: "https://pizzahub-server-mu.vercel.app/api/dashboard/:path*",
      },
      {
        source: "/api/users/:path*",
        destination: "https://pizzahub-server-mu.vercel.app/api/users/:path*",
      },
      {
        source: "/api/upload/:path*",
        destination: "https://pizzahub-server-mu.vercel.app/api/upload/:path*",
      },
    ];
  },
};

export default nextConfig;
