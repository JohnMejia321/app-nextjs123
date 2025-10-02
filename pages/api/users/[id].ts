/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Editar usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (req.method === 'PUT') {
    // Editar usuario, solo admin
    const session = await requireAdmin(req, res);
    if (!session) return;

    const { name, role } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: { name, role },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });
      res.status(200).json(user);
    } catch {
      res.status(500).json({ error: 'Error updating user' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
