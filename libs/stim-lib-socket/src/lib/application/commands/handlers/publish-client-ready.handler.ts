import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { ClientConnectionReadyEvent } from '../../events/impl/client-connection-ready.event';
import { PublishClientReadyCommand } from '../impl/publish-client-ready.command';

@CommandHandler(PublishClientReadyCommand)
export class PublishClientReadyHandler implements ICommandHandler<PublishClientReadyCommand, void> {
  private readonly logger: Logger = new Logger(PublishClientReadyHandler.name);

  constructor(private readonly eventBus: EventBus) {}

  async execute(command: PublishClientReadyCommand): Promise<void> {
    this.logger.debug('Publikuji událost, že je klient připraven.');
    await this.eventBus.publish(new ClientConnectionReadyEvent(command.clientID));
  }
}
