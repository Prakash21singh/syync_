import { Queue } from 'bullmq';
import { redis } from '../redis';

export const discoveryQueue = new Queue(process.env.DISCOVERY_QUEUE_NAME!, {
  connection: redis,
});
