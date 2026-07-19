import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/request-cv": ["src/server-assets/cv/**/*"],
  },
  /* config options here */
};

export default nextConfig;
