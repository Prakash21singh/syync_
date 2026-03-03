import { redis } from '../redis';

import { Queue } from 'bullmq';

export const migrationQueue = new Queue('migration-queue', {
  connection: redis,
});
