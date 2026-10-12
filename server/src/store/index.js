import { memoryStore } from './memoryStore.js';

/** Swap to PostgreSQL implementation when DATABASE_URL is wired (see db/schema.sql). */
export const store = memoryStore;
