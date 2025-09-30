/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Obtener información del usuario actual
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN]
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await requireAuth(req, res);
    if (!session) return;

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}