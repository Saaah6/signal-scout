/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds to complete even if there are type errors
    ignoreBuildErrors: true,
  },
  // ESLint config moved to next lint options (eslint key no longer supported in nextConfig)
};

export default nextConfig;
