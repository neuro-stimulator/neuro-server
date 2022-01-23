import { Logger } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcMessage, LOG_TAG } from '@neuro-server/stim-feature-ipc/domain';

import { IpcMessageEvent } from '../impl/ipc-message.event';
import { IpcEvent } from '../impl/ipc.event';

@EventsHandler(IpcMessageEvent)
export class IpcMessageHandler implements IEventHandler<IpcMessageEvent> {
  private readonly logger: Logger = new Logger(IpcMessageHandler.name);

  constructor(private readonly eventBus: EventBus) {}

  async handle(event: IpcMessageEvent): Promise<void> {
    const messageJSON = event.buffer.toString('utf-8');
    this.logger.log({ message: `Přišla nová zpráva z přehrávače multimédií: ${messageJSON}`, label: LOG_TAG });

    try {
      // Nechám naparsovat příchozí data
      const message: IpcMessage<unknown> = JSON.parse(messageJSON);

      this.logger.debug(`Příkaz s id: '${message.commandID}' je typu: '${message.topic}'`);
      this.logger.debug('Publikuji novou událost s příkazem z přehrávače multimédií.');
      // Publikuji novou událost s již naparsovanými daty
      this.eventBus.publish(new IpcEvent<unknown>(message));
    } catch (e) {
      this.logger.error('Vyskytla se naznámá chyba při zpracování příkazu z přehrávače multimédií!');
      this.logger.error(e.message);
    }
  }
}
