/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Optimize for S3 static hosting
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  distDir: 'out',
};

export default nextConfig;
