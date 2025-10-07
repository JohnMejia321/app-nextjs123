import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } };

const allowedOrigins = [
  'https://app-nextjs123-xb82-6sd4gtpy2-johnmejia321s-projects.vercel.app',
  'https://app-nextjs123-xb82-77p4oh9kv-johnmejia321s-projects.vercel.app',
  'https://app-nextjs123-xb82-z9m6qz94g-johnmejia321s-projects.vercel.app',
  'https://app-nextjs123-xb82.vercel.app',
  'http://localhost:3000'
];

const handler = toNodeHandler(auth.handler);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const origin = req.headers.origin;

  // Handle CORS
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Set cookie options
  res.setHeader('Set-Cookie', [
    '_vercel_sso_nonce=; Path=/; Secure; SameSite=None',
    'session=; Path=/; Secure; SameSite=None; HttpOnly'
  ]);

  const response = await handler(req, res);

  // Ensure all cookies are set with SameSite=None
  const cookies = res.getHeader('Set-Cookie');
  if (cookies) {
    const newCookies = (Array.isArray(cookies) ? cookies : [cookies]).map(cookie => {
      if (typeof cookie === 'string' && !cookie.includes('SameSite=')) {
        return cookie.replace(/; Secure/, '; Secure; SameSite=None');
      }
      return String(cookie);
    });
    res.setHeader('Set-Cookie', newCookies as string[]);
  }

  return response;
};
