import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configura la autenticación usando better-auth con adaptador de Prisma para PostgreSQL, incluyendo login social con GitHub y cambio de email.
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  trustedOrigins: ['https://app-nextjs123-xb82-6sd4gtpy2-johnmejia321s-projects.vercel.app', 'http://localhost:3000'],
});

export type Session = typeof auth.$Infer.Session;
