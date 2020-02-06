import { Controller, Logger, Options, Param, Patch } from '@nestjs/common';

import { CommandsService } from './commands.service';

@Controller('api/commands')
export class CommandsController {

  private readonly logger: Logger = new Logger(CommandsController.name);

  constructor(private readonly service: CommandsService) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Patch('experiment/upload/:id')
  public async uploadExperiment(@Param() params: {id: number}) {
    await this.service.uploadExperiment(params.id);
  }

  @Patch('experiment/setup/:id')
  public async setupExperiment(@Param() params: {id: number}) {
    await this.service.setupExperiment(params.id);
  }

  @Patch('experiment/start/:id')
  public startExperiment(@Param() params: {id: number}) {
    this.service.startExperiment(params.id);
  }

  @Patch('experiment/stop/:id')
  public stopExperiment(@Param() params: {id: number}) {
    this.service.stopExperiment(params.id);
  }

  @Patch('experiment/clear')
  public clearExperiment() {
    this.service.clearExperiment();
  }

  // Mimo oficiální protokol
  // V budoucnu se odstraní
  @Patch('toggle-led/:index/:enabled')
  public toggleLed(@Param() params: {index: string, enabled: string}) {
    this.service.togleLed(+params.index, +params.enabled);
  }

}
