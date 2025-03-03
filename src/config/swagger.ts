import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  const swaggerFile = path.resolve(__dirname, '../../swagger.yaml'); // или swagger.json

  if (!fs.existsSync(swaggerFile)) {
    console.error('⚠️ Swagger файл не найден. Убедитесь, что он есть.');
    return;
  }

  const fileContents = fs.readFileSync(swaggerFile, 'utf8');
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swaggerDocument = yaml.load(fileContents) as Record<string, any>;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('✅ Swagger UI доступен по /api-docs');
}

