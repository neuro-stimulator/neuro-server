import { Logger } from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

import { BaseBlockingHandler, CommandIdService } from '@diplomka-backend/stim-lib-common';
import { StimulatorCommandType, StimulatorData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { StimulatorBlockingCommandFailedEvent } from '../../../events/impl/stimulator-blocking-command-failed.event';
import { StimulatorEvent } from '../../../events/impl/stimulator.event';
import { StimulatorBlockingCommand } from '../../impl/base/stimulator-blocking.command';

export abstract class BaseStimulatorBlockingHandler<TCommand extends StimulatorBlockingCommand> extends BaseBlockingHandler<
  TCommand,
  StimulatorCommandType,
  StimulatorEvent,
  StimulatorData
> {
  private _timeOut: number;

  protected constructor(private readonly settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus, logger: Logger) {
    super(commandIdService, eventBus, logger);
  }

  protected async init(command: TCommand): Promise<void> {
    const settings: Settings = await this.settings.getSettings();
    this._timeOut = <number>settings.stimulatorResponseTimeout;
  }

  protected provideBlockingFailedEvent(commandType: StimulatorCommandType): IEvent {
    return new StimulatorBlockingCommandFailedEvent(commandType);
  }

  protected isRequestedEvent(event: IEvent): boolean {
    return event instanceof StimulatorEvent;
  }

  protected get timeoutValue(): number {
    return this._timeOut;
  }
}
