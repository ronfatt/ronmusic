/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: new URL(".", import.meta.url).pathname
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "img.youtube.com" }
    ]
  }
};

export default nextConfig;
