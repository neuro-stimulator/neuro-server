import { Controller, Logger, Post } from '@nestjs/common';

import { ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

import { SeedFacade } from '../service/seed.facade';

@Controller('/api/seed')
export class SeedController {
  private readonly logger: Logger = new Logger(SeedController.name);

  constructor(private readonly facade: SeedFacade) {}

  @Post()
  public async seed(): Promise<ResponseObject<SeedStatistics>> {
    try {
      const seedStatistics: SeedStatistics = await this.facade.seed();
      return {
        data: seedStatistics,
      };
    } catch (error) {
      this.logger.error('Nastala neočekávaná chyba při seedování databáze');
      this.logger.error(error.message);
      this.logger.error(error.stack);
      throw new ControllerException();
    }
  }
}
