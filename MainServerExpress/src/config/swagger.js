import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { ENV } from './env.js';
import { join } from 'path';

export function setupSwagger(app) {
  const routesPath = join(ENV.__dirname, '../routes/*.js'); 

  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'Main Server API', version: '1.0.0' },
      servers: [{ url: `http://localhost:${ENV.PORT}`, description: 'Local Gateway' }],
    },
    apis: [routesPath],
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));
}
