import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } };

const allowedOrigins = [
  'https://app-nextjs123-xb82-6sd4gtpy2-johnmejia321s-projects.vercel.app',
  'https://app-nextjs123-xb82-77p4oh9kv-johnmejia321s-projects.vercel.app',
  'http://localhost:3000'
];

const handler = toNodeHandler(auth.handler);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return handler(req, res);
};
