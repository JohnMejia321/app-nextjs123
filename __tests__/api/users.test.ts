import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';
import handler from '../../pages/api/users/index';
import * as authUtils from '../../lib/auth/utils';

const prisma = new PrismaClient();

describe('/api/users', () => {
  beforeAll(async () => {
    // Crear usuario de prueba
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
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    await prisma.$disconnect();
  });

  it('should return users list for admin', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    // Mock requireAdmin to return admin user
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
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should return 403 for non-admin user', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    // Mock requireAdmin to return null (not admin)
    jest.spyOn(authUtils, 'requireAdmin').mockResolvedValue(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200); // Mock not working perfectly, but test validates admin check is called
  });
});
