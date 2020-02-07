import { Controller, Logger, Options, Param, Patch } from '@nestjs/common';

import { CommandsService } from './commands.service';
import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

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
  public async uploadExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      await this.service.uploadExperiment(params.id);
    } catch (error) {
      this.logger.error(error);
      return { message: { code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_UPLOAD }};
    }
  }

  @Patch('experiment/setup/:id')
  public async setupExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      await this.service.setupExperiment(params.id);
    } catch (error) {
      return { message: { code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_SETUP }};
    }
  }

  @Patch('experiment/start/:id')
  public async startExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      this.service.startExperiment(params.id);
    } catch (error) {
      return { message: { code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_START }};
    }
  }

  @Patch('experiment/stop/:id')
  public async stopExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      this.service.stopExperiment(params.id);
    } catch (error) {
      return { message: { code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_STOP }};
    }
  }

  @Patch('experiment/clear')
  public async clearExperiment(): Promise<ResponseObject<void>> {
    try {
      this.service.clearExperiment();
    } catch (error) {
      return { message: { code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_CLEAR }};
    }
  }

  // Mimo oficiální protokol
  // V budoucnu se odstraní
  @Patch('toggle-led/:index/:enabled')
  public toggleLed(@Param() params: {index: string, enabled: string}) {
    this.service.togleLed(+params.index, +params.enabled);
  }

}
