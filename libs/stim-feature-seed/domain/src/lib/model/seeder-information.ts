import { SeederService } from './seeder-service';

export interface SeederInformation {
  entity: any;
  services: SeederService<unknown>[];
  order: number;
}
