import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirmwareUpdatedEvent } from '@diplomka-backend/stim-feature-stimulator';

import { FirmwareFileDeleteCommand } from '../commands/impl/firmware-file-delete.command';

@Injectable()
export class StimulatorSaga {
  @Saga()
  firmwareUpdated$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(FirmwareUpdatedEvent),
      map(
        (event: FirmwareUpdatedEvent) =>
          new FirmwareFileDeleteCommand(event.path)
      )
    );
  };
}
