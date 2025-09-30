/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener lista de usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [USER, ADMIN]
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Listar usuarios, solo admin
    const session = await requireAdmin(req, res);
    if (!session) return;

    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}