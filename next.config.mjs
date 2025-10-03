/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Asegurarnos de que la aplicación sea pública
  experimental: {
    isExternalDir: true,
  },
  // Permitir acceso público
  skipMiddlewareUrlNormalize: true,
  async headers() {
    const headers = [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie'
          },
          {
            key: 'Access-Control-Expose-Headers',
            value: 'Set-Cookie'
          },
          {
            key: 'Set-Cookie',
            value: '_vercel_sso_nonce=; Path=/; Secure; SameSite=None; HttpOnly'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
