/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@eldritch/domain"],
  swcMinify: false, // Disable SWC minification to use standard Terser
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

module.exports = nextConfig;
