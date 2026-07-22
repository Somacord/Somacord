import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local brand/photography assets live in /public. Add Supabase Storage
    // (or another CDN) remote patterns here once avatar/gathering-photo
    // uploads are implemented — e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "<project-ref>.supabase.co", pathname: "/storage/v1/object/public/**" }]
    remotePatterns: [],
  },
};

export default nextConfig;
