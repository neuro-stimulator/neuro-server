import { Controller, Delete, Logger, Post } from '@nestjs/common';

import { ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@neuro-server/stim-lib-common';
import { SeedStatistics } from '@neuro-server/stim-feature-seed/domain';

import { SeedFacade } from '../service/seed.facade';

@Controller('/api/seed')
export class SeedController {
  private readonly logger: Logger = new Logger(SeedController.name);

  constructor(private readonly facade: SeedFacade) {}

  @Post()
  public async seed(): Promise<ResponseObject<SeedStatistics>> {
    this.logger.log('Přišel požadavek na inicializaci databáze.');
    try {
      const seedStatistics: SeedStatistics = await this.facade.seed();
      return {
        data: seedStatistics,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při seedování databáze');
      this.logger.error(e.message);
      this.logger.error(e.stack);
      throw new ControllerException();
    }
  }

  @Delete()
  public async truncate(): Promise<ResponseObject<SeedStatistics>> {
    this.logger.log('Přišel požadavek na vyprázdnění obsahu databáze.');
    try {
      const truncateStatistics: SeedStatistics = await this.facade.truncate();
      return {
        data: truncateStatistics,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při vyprazdňování databáze!');
      this.logger.error(e.message);
      this.logger.error(e.stack);
      throw new ControllerException();
    }
  }
}
