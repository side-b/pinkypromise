const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const EXPORT = process.env.EXPORT === "true";

module.exports = async () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    output: EXPORT ? "export" : undefined,
    images: EXPORT ? { unoptimized: true } : undefined,
  };

  return withBundleAnalyzer(nextConfig);
};
