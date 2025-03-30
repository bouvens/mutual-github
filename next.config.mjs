/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forces Next.js to export the app as static HTML/CSS/JS
  output: 'export',
  // Required for GitHub Pages compatibility
  basePath: process.env.NODE_ENV === 'production' ? '/mutual-github' : '',
  // Disable image optimization at build time since it requires server components
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
