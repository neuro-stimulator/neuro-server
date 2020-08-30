import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { SaveSerialPathIfNecessaryCommand } from '../commands/impl/save-serial-path-if-necessary.command';
import { SendStimulatorConnectedToClientCommand } from '../commands/impl/to-client/send-stimulator-connected-to-client.command';
import { SendStimulatorDisconnectedToClientCommand } from '../commands/impl/to-client/send-stimulator-disconnected-to-client.command';
import { SerialOpenEvent } from '../events/impl/serial-open.event';
import { SerialClosedEvent } from '../events/impl/serial-closed.event';

@Injectable()
export class SerialSaga {
  @Saga()
  serialOpen$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SerialOpenEvent),
      map((event: SerialOpenEvent) => [new SaveSerialPathIfNecessaryCommand(event.path), new SendStimulatorConnectedToClientCommand()]),
      mergeMap((actions) => actions)
    );
  };

  @Saga()
  serialClose$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SerialClosedEvent),
      map((event: SerialClosedEvent) => new SendStimulatorDisconnectedToClientCommand())
    );
  };
}
