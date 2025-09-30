import { auth } from './index';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
  });
  const session = await auth.api.getSession({ headers });
  return session;
}

export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden: Admin required' });
    return null;
  }

  return session;
}