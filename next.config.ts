import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rewrite API calls to your backend server
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },

  // Optional: Image optimization
  images: {
    unoptimized: true, // Set false if you want Vercel Image Optimization
  },
};

export default nextConfig;
