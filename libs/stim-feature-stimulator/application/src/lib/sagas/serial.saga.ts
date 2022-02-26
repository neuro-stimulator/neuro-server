import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { SaveSerialPathIfNecessaryCommand } from '../commands/impl/save-serial-path-if-necessary.command';
import { SendStimulatorConnectedToClientCommand } from '../commands/impl/to-client/send-stimulator-connected-to-client.command';
import { SendStimulatorDisconnectedToClientCommand } from '../commands/impl/to-client/send-stimulator-disconnected-to-client.command';
import { SerialClosedEvent } from '../events/impl/serial-closed.event';
import { SerialOpenEvent } from '../events/impl/serial-open.event';

@Injectable()
export class SerialSaga {
  @Saga()
  serialOpen$ = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SerialOpenEvent),
      map((event: SerialOpenEvent) => [new SaveSerialPathIfNecessaryCommand(event.path), new SendStimulatorConnectedToClientCommand()]),
      mergeMap((actions) => actions)
    );
  };

  @Saga()
  serialClose$ = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SerialClosedEvent),
      map(() => new SendStimulatorDisconnectedToClientCommand())
    );
  };
}
