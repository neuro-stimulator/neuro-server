import { Controller, Get, Logger, Options, Param, Patch } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { EventStimulatorState } from "../low-level/protocol/hw-events";
import { CommandsService } from "./commands.service";

@Controller('api/commands')
export class CommandsController {

  private readonly logger: Logger = new Logger(CommandsController.name);

  constructor(private readonly _service: CommandsService) {}

  private static _createErrorMessage(code: number, error: any, params?: any): ResponseObject<any> {
    if (!isNaN(parseInt(error.message, 10))) {
      return { message: { code: parseInt(error.message, 10), params }};
    }

    return { message: { code }};
  }

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get('stimulator-state')
  public async stimulatorState(): Promise<ResponseObject<EventStimulatorState|undefined>> {
    try {
      const state = await this._service.stimulatorState();
      return { data: state };
    } catch (error) {
      return CommandsController._createErrorMessage(MessageCodes.CODE_ERROR_COMMANDS_STIMULATOR_STATE, error);
    }
  }

  @Patch('experiment/upload/:id')
  public async uploadExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      await this._service.uploadExperiment(+params.id);
    } catch (error) {
      return CommandsController._createErrorMessage(MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_UPLOAD, error, params);
    }
  }

  @Patch('experiment/setup/:id')
  public async setupExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      await this._service.setupExperiment(+params.id);
    } catch (error) {
      return CommandsController._createErrorMessage(MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_SETUP, error, params);
    }
  }

  @Patch('experiment/run/:id')
  public async runExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      this._service.runExperiment(+params.id);
    } catch (error) {
      return CommandsController._createErrorMessage(MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_RUN, error, params);
    }
  }

  @Patch('experiment/pause/:id')
  public async pauseExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      this._service.pauseExperiment(+params.id);
    } catch (error) {
      return CommandsController._createErrorMessage(MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_PAUSE, error, params);
    }
  }

  @Patch('experiment/finish/:id')
  public async finishExperiment(@Param() params: {id: number}): Promise<ResponseObject<void>> {
    try {
      this._service.finishExperiment(+params.id);
    } catch (error) {
      return CommandsController._createErrorMessage(MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_FINISH, error, params);
    }
  }

  @Patch('experiment/clear')
  public async clearExperiment(): Promise<ResponseObject<void>> {
    try {
      this._service.clearExperiment();
    } catch (error) {
      return CommandsController._createErrorMessage(MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_CLEAR, error);
    }
  }

  // Mimo oficiální protokol
  // V budoucnu se odstraní
  @Patch('toggle-led/:index/:enabled')
  public toggleLed(@Param() params: {index: string, enabled: string}) {
    this._service.togleLed(+params.index, +params.enabled);
  }

}
