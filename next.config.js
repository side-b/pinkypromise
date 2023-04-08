const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = async () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
  };

  return withBundleAnalyzer(nextConfig);
};
