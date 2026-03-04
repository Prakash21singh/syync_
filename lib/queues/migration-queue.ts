import { redis } from '../redis';

import { Queue } from 'bullmq';

export const migrationQueue = new Queue(process.env.MIGRATION_QUEUE_NAME!, {
  connection: redis,
});
