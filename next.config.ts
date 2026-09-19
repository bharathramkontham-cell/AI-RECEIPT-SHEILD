import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next's file tracing inside this project. A parent-level lockfile would
  // otherwise make Next infer C:\\Users\\bhara as the workspace root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
