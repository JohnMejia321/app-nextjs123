import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the origin
  const origin = req.headers.origin || '*';

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the session
    const session = await auth.getSession(req);

    // Set cookie with correct attributes
    res.setHeader('Set-Cookie', [
      '_vercel_sso_nonce=; Path=/; Secure; SameSite=None; HttpOnly',
      'session=; Path=/; Secure; SameSite=None; HttpOnly'
    ]);

    return res.status(200).json(session);
  } catch (error) {
    console.error('Session error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}