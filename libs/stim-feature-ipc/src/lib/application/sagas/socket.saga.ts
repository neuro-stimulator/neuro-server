import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientConnectedEvent } from '@diplomka-backend/stim-lib-socket';

import { SendIpcStateToClientCommand } from '../commands/impl/send-ipc-state-to-client.command';

@Injectable()
export class SocketSaga {
  @Saga()
  clientConnectedEvent$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze ClientConnectedEvent
      ofType(ClientConnectedEvent),
      // Přemapuji událost na příkaz pro odeslání IPC stavu
      map((event: ClientConnectedEvent) => {
        return new SendIpcStateToClientCommand(event.clientID);
      })
    );
  };
}
