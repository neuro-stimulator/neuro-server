import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { SerialOpenEvent } from '@diplomka-backend/stim-feature-stimulator';
import { map } from 'rxjs/operators';

import { SaveSerialPathIfNecessaryCommand } from '../commands/impl/save-serial-path-if-necessary.command';

@Injectable()
export class SerialSaga {
  @Saga()
  serialOpen$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SerialOpenEvent),
      map(
        (event: SerialOpenEvent) =>
          new SaveSerialPathIfNecessaryCommand(event.path)
      )
    );
  };
}
