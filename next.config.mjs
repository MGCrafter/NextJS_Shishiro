/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['motion'],
  output: 'standalone', // Enables optimized Docker builds
};

export default nextConfig;
