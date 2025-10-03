import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production' ? '/api/auth' : 'http://localhost:3000/api/auth',
});
