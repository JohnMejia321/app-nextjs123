import { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Ingresos y Egresos',
      version: '1.0.0',
      description:
        'API para gestionar movimientos financieros, usuarios y reportes',
    },
    servers: [
      {
        url: 'https://app-nextjs123-xb82.vercel.app',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./pages/api/**/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(specs);
}
