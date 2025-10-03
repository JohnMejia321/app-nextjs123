import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000/api/auth',
  credentials: 'include',
  headers: {
    'Access-Control-Allow-Credentials': 'true',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  cookies: {
    sameSite: 'none',
    secure: true
  },
  cors: {
    origin: '*',
    credentials: true
  }
});
