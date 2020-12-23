import { SeedHandler } from './handler/seed.handler';
import { TruncateHandler } from './handler/truncate.handler';
import { DatabaseDumpHandler } from './handler/database-dump.handler';

export const COMMANDS = [SeedHandler, TruncateHandler, DatabaseDumpHandler];
