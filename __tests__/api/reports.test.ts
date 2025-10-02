import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';
import handler from '../../pages/api/reports/index';
import * as authUtils from '../../lib/auth/utils';

const prisma = new PrismaClient();

describe('/api/reports', () => {
  beforeAll(async () => {
    // Crear usuario de prueba primero
    await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: { role: 'ADMIN' },
      create: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Crear datos de prueba
    await prisma.movement.deleteMany();
    await prisma.movement.createMany({
      data: [
        {
          id: 'test-income-1',
          concept: 'Salario',
          amount: 5000,
          date: new Date('2024-01-01'),
          userId: 'test-user-id',
        },
        {
          id: 'test-expense-1',
          concept: 'Alquiler',
          amount: -1000,
          date: new Date('2024-01-02'),
          userId: 'test-user-id',
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.movement.deleteMany();
    await prisma.$disconnect();
  });

  it('should return correct balance calculation', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    // Mock requireAdmin
    jest.spyOn(authUtils, 'requireAdmin').mockResolvedValue({
      user: {
        id: 'test-user-id',
        name: 'Test',
        email: 'test@test.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    } as any);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.balance).toBe(4000); // 5000 + (-1000)
    expect(data.chart).toBeDefined();
    expect(Array.isArray(data.chart)).toBe(true);
  });

  it('should return chart data grouped by day', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    jest.spyOn(authUtils, 'requireAdmin').mockResolvedValue({
      user: {
        id: 'test-user-id',
        name: 'Test',
        email: 'test@test.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    } as any);

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.chart.length).toBeGreaterThan(0);
    const firstEntry = data.chart[0];
    expect(firstEntry).toHaveProperty('day');
    expect(firstEntry).toHaveProperty('ingresos');
    expect(firstEntry).toHaveProperty('egresos');
  });

  it('should return CSV format when requested', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { format: 'csv' },
    });

    jest.spyOn(authUtils, 'requireAdmin').mockResolvedValue({
      user: {
        id: 'test-user-id',
        name: 'Test',
        email: 'test@test.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    } as any);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['content-type']).toBe('text/csv');
    const csv = res._getData();
    expect(csv).toContain('Concepto,Tipo,Monto,Fecha,Usuario');
    expect(csv).toContain('Salario');
    expect(csv).toContain('Alquiler');
  });
});
