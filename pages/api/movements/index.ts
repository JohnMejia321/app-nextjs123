/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Obtener lista de movimientos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   concept:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   userId:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *   post:
 *     summary: Crear nuevo movimiento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concept
 *               - amount
 *               - date
 *             properties:
 *               concept:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Movimiento creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Listar movimientos, accesible para todos autenticados
    const session = await requireAuth(req, res);
    if (!session) return;

    try {
      const movements = await prisma.movement.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { date: 'desc' },
      });
      res.status(200).json(movements);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching movements' });
    }
  } else if (req.method === 'POST') {
    // Crear movimiento, solo admin
    const session = await requireAdmin(req, res);
    if (!session) return;

    const { concept, amount, type, date } = req.body;
    if (!concept || !amount || !type || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

// Valida campos requeridos y tipo, luego crea el movimiento en la base de datos.
    try {
      const movement = await prisma.movement.create({
        data: {
          concept,
          amount: Math.abs(parseFloat(amount)), // Siempre positivo
          type,
          date: new Date(date),
          userId: session.user.id,
        },
      });
      res.status(201).json(movement);
    } catch (error) {
      res.status(500).json({ error: 'Error creating movement' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}