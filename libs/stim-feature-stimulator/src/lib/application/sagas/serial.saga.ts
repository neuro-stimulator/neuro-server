import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import {
  SerialClosedEvent,
  SerialOpenEvent,
} from '@diplomka-backend/stim-feature-stimulator';
import { flatMap, map } from 'rxjs/operators';

import { SaveSerialPathIfNecessaryCommand } from '../commands/impl/save-serial-path-if-necessary.command';
import { SendStimulatorConnectedToClientCommand } from '../commands/impl/to-client/send-stimulator-connected-to-client.command';
import { SendStimulatorDisconnectedToClientCommand } from '../commands/impl/to-client/send-stimulator-disconnected-to-client.command';

@Injectable()
export class SerialSaga {
  @Saga()
  serialOpen$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SerialOpenEvent),
      map((event: SerialOpenEvent) => [
        new SaveSerialPathIfNecessaryCommand(event.path),
        new SendStimulatorConnectedToClientCommand(),
      ]),
      flatMap((actions) => actions)
    );
  };

  @Saga()
  serialClose$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SerialClosedEvent),
      map(
        (event: SerialClosedEvent) =>
          new SendStimulatorDisconnectedToClientCommand()
      )
    );
  };
}
