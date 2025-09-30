/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Obtener reportes financieros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv]
 *         description: Formato de respuesta (opcional para CSV)
 *     responses:
 *       200:
 *         description: Datos del reporte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                 chart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       total:
 *                         type: number
 *           text/csv:
 *             schema:
 *               type: string
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Reportes, solo admin
    const session = await requireAdmin(req, res);
    if (!session) return;

    try {
      const movements = await prisma.movement.findMany({
        orderBy: { date: 'asc' },
      });

      // Calcular saldo actual
      const balance = movements.reduce((sum: number, m: any) => {
        return m.type === 'INCOME' ? sum + m.amount : sum - m.amount;
      }, 0);

      // Datos para gráfico: agrupar por día ingresos y egresos
      const chartData = movements.reduce((acc: Record<string, { ingresos: number; egresos: number }>, m: any) => {
        const day = m.date.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!acc[day]) acc[day] = { ingresos: 0, egresos: 0 };
        if (m.type === 'INCOME') {
          acc[day].ingresos += m.amount;
        } else {
          acc[day].egresos += m.amount;
        }
        return acc;
      }, {} as Record<string, { ingresos: number; egresos: number }>);

      const chart = Object.entries(chartData)
        .sort(([a], [b]) => a.localeCompare(b)) // Ordenar por fecha
        .map(([day, data]) => ({
          day,
          ingresos: (data as { ingresos: number; egresos: number }).ingresos,
          egresos: (data as { ingresos: number; egresos: number }).egresos,
        }));

      // Para CSV
      if (req.query.format === 'csv') {
        const csv = 'Concepto,Tipo,Monto,Fecha,Usuario\n' +
          movements.map((m: any) => `${m.concept},${m.type},${m.amount},${m.date.toISOString().split('T')[0]},${m.userId}`).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
        res.status(200).send(csv);
        return;
      }

      res.status(200).json({ balance, chart });
    } catch (error) {
      res.status(500).json({ error: 'Error generating report' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}