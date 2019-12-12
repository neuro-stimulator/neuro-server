import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface IoEventInmemoryEntity extends InMemoryDBEntity {
  ioType: 'input' | 'output';
  state: 'on' | 'off';
  index: number;
  timestamp: number;
}

