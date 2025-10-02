// jest.setup.js
require('dotenv').config({ path: '.env.local' });

// Mock better-auth globally
jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    api: {
      getSession: jest.fn(),
    },
  })),
}));

jest.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: jest.fn(),
}));

jest.mock('better-auth/react', () => ({
  createAuthClient: jest.fn(() => ({
    getSession: jest.fn(),
    signIn: {
      social: jest.fn(),
    },
    signOut: jest.fn(),
  })),
  SessionProvider: ({ children }) => children,
}));
