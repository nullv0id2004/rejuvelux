/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Retired routes, and the platform-style paths the content handover uses
   * (/pages, /products, /blogs/journal), mapped onto this site's routes.
   * Temporary (307) until the site launches and the route set is final.
   */
  async redirects() {
    return [
      { source: '/blog', destination: '/journal', permanent: false },
      { source: '/blog/:slug', destination: '/journal', permanent: false },
      { source: '/garden', destination: '/assam-origin', permanent: false },
      { source: '/wholesale', destination: '/corporate-gifting', permanent: false },
      { source: '/pages/the-craft', destination: '/craft', permanent: false },
      { source: '/pages/:slug', destination: '/:slug', permanent: false },
      { source: '/products/:slug', destination: '/shop/:slug', permanent: false },
      { source: '/collections/all-teas', destination: '/shop', permanent: false },
      { source: '/blogs/journal', destination: '/journal', permanent: false },
      { source: '/blogs/journal/:slug', destination: '/journal/:slug', permanent: false },
    ];
  },
};

export default nextConfig;
