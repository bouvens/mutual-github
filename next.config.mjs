const nextConfig = {
  // Forces Next.js to export the app as static HTML/CSS/JS
  output: 'export',
  // Disable image optimization at build time since it requires server components
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
