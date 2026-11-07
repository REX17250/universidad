import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Genera /productos/index.html: Firebase Hosting lo sirve sin configuración extra
  trailingSlash: true,
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
