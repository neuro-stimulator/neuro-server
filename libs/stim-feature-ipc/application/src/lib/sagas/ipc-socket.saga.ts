import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { ExperimentToggleOutputSynchronizationMessage, IpcSynchronizationMessage, SocketMessageSpecialization, SocketMessageType } from '@stechy1/diplomka-share';

import { BroadcastCommand, MessageArivedEvent } from '@diplomka-backend/stim-lib-socket';
import { OutputSynchronizationStateChangedMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcEvent } from '../event/impl/ipc.event';
import { IpcUpdateOutputDataCommand } from '../commands/impl/ipc-update-output-data.command';
import { IpcService } from '../services/ipc.service';

@Injectable()
export class IpcSocketSaga {
  private readonly logger: Logger = new Logger(IpcSocketSaga.name);

  constructor(private readonly service: IpcService) {}

  @Saga()
  ipcOutputSynchronizationMessageRaised$ = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze IpcEvent
      ofType(IpcEvent),
      // A to takový, který obsahuje zprávu o změně synchronizace výsutupů
      filter((event: IpcEvent<unknown>) => event.topic === OutputSynchronizationStateChangedMessage.name),
      // Event musí mít commandID = 0
      filter((event: IpcEvent<unknown>) => event.commandID === 0),
      // Získám objekt s daty
      map((event: IpcEvent<unknown>) => event.data),
      map((message: OutputSynchronizationStateChangedMessage) => new BroadcastCommand(new ExperimentToggleOutputSynchronizationMessage(message.data.synchronize)))
    );
  };

  @Saga()
  clientReady$ = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(MessageArivedEvent),
      filter((event: MessageArivedEvent) => event.message.specialization === SocketMessageSpecialization.ASSET_PLAYER),
      filter((event: MessageArivedEvent) => event.message.type === SocketMessageType.ASSET_PLAYER_SYNCHRONIZATION),
      map((event: MessageArivedEvent) => event.message),
      map((message: IpcSynchronizationMessage) => {
        return new IpcUpdateOutputDataCommand(message.data.id, 'image', message.data.x, message.data.y);
      }),
      catchError((err) => {
        this.logger.error('Nastala chyba při zpracování zprávy od klienta, že je připraven.');
        this.logger.error(err);
        return EMPTY;
      })
    );
  };
}
