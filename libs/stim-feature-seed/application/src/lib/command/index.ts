import { DatabaseDumpHandler } from './handler/database-dump.handler';
import { SeedHandler } from './handler/seed.handler';
import { TruncateHandler } from './handler/truncate.handler';

export const COMMANDS = [SeedHandler, TruncateHandler, DatabaseDumpHandler];
