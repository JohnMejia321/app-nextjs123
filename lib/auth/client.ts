import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/auth` : 'http://localhost:3000/api/auth',
});
