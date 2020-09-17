import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { SocketMessageSpecialization, SocketMessageType } from '@stechy1/diplomka-share';

import { MessageArivedEvent } from '../events/impl/message-arived.event';
import { PublishClientReadyCommand } from '../commands/impl/publish-client-ready.command';

@Injectable()
export class SocketSaga {
  private readonly logger: Logger = new Logger(SocketSaga.name);

  @Saga()
  clientReady$ = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(MessageArivedEvent),
      filter((event: MessageArivedEvent) => event.message.specialization === SocketMessageSpecialization.CLIENT),
      filter((event: MessageArivedEvent) => event.message.type === SocketMessageType.CLIENT_READY),
      map((event: MessageArivedEvent) => {
        return new PublishClientReadyCommand(event.clientID);
      }),
      catchError((err) => {
        this.logger.error('Nastala chyba při zpracování zprávy od klienta, že je připraven.');
        this.logger.error(err);
        return EMPTY;
      })
    );
  };
}
