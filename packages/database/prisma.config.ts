import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

// carrega o .env da raiz do monorepo (mag-system-v2/.env)
dotenv.config({ path: '../../.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
});
