import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, flatMap, map } from 'rxjs/operators';

import {
  FirmwareUpdatedEvent,
  StimulatorEvent,
  StimulatorStateData,
} from '@diplomka-backend/stim-feature-stimulator';

import { FirmwareFileDeleteCommand } from '../commands/impl/firmware-file-delete.command';
import { SendStimulatorDataToClientCommand } from '../commands/impl/send-stimulator-data-to-client.command';
import { SendIpcStimulatorStateChangeCommand } from '../commands/impl/send-ipc-stimulator-state-change.command';

@Injectable()
export class StimulatorSaga {
  private readonly logger: Logger = new Logger(StimulatorSaga.name);

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

  @Saga()
  stimulatorEventRaised$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze StimulatorEvent
      ofType(StimulatorEvent),
      // Dále pouze takový, který obsahuje informaci o stavu stimulátoru
      filter(
        (event: StimulatorEvent) => event.data.name === StimulatorStateData.name
      ),
      // Vytáhnu data z události
      map((event: StimulatorEvent) => event.data),
      // Přemapuji událost na příkazy pro odeslání nového stavu jak IPC klientovi
      // tak i všem webovým klientům
      map((data: StimulatorStateData) => [
        new SendStimulatorDataToClientCommand(data),
        new SendIpcStimulatorStateChangeCommand(data.state),
      ]),
      flatMap((events) => events),
      // V případě, že se vyskytne chyba
      catchError((err, caught) => {
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
