import { Injectable } from '@nestjs/common';

@Injectable()
export class IpcSocketSaga {
  // @Saga()
  // clientConnectedEvent$ = (events$: Observable<any>): Observable<ICommand> => {
  //   return events$.pipe(
  //     // Zajímá mě pouze ClientConnectedEvent
  //     ofType(ClientConnectedEvent),
  //     // Přemapuji událost na příkaz pro odeslání IPC stavu
  //     map((event: ClientConnectedEvent) => {
  //       return new SendIpcStateToClientCommand(event.clientID);
  //     })
  //   );
  // };
}
