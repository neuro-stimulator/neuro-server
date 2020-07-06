import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, flatMap, map } from 'rxjs/operators';

import { StimulatorStateData, StimulatorIoChangeData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { FirmwareFileDeleteCommand } from '../commands/impl/firmware-file-delete.command';
import { SendStimulatorStateChangeToClientCommand } from '../commands/impl/to-client/send-stimulator-state-change-to-client.command';
import { SendStimulatorStateChangeToIpcCommand } from '../commands/impl/to-ipc/send-stimulator-state-change-to-ipc.command';
import { SendStimulatorIoDataToClientCommand } from '../commands/impl/to-client/send-stimulator-io-data-to-client.command';
import { FirmwareUpdatedEvent } from '../events/impl/firmware-updated.event';
import { StimulatorEvent } from '../events/impl/stimulator.event';

@Injectable()
export class StimulatorSaga {
  private readonly logger: Logger = new Logger(StimulatorSaga.name);

  @Saga()
  firmwareUpdated$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(FirmwareUpdatedEvent),
      map((event: FirmwareUpdatedEvent) => new FirmwareFileDeleteCommand(event.path))
    );
  };

  @Saga()
  stimulatorStateEventRaised$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze StimulatorEvent
      ofType(StimulatorEvent),
      // Dále pouze takový, který obsahuje informaci o stavu stimulátoru
      filter((event: StimulatorEvent) => event.data.name === StimulatorStateData.name),
      // Event musí mít commandID = 0
      filter((event: StimulatorEvent) => event.commandID === 0),
      // Vytáhnu data z události
      map((event: StimulatorEvent) => event.data),
      // Přemapuji událost na příkazy pro odeslání nového stavu jak IPC klientovi
      // tak i všem webovým klientům
      map((data: StimulatorStateData) => [new SendStimulatorStateChangeToClientCommand(data.state), new SendStimulatorStateChangeToIpcCommand(data.state)]),
      flatMap((events) => events),
      // V případě, že se vyskytne chyba
      catchError((err, caught) => {
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };

  @Saga()
  stimulatorIOEventRaised$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze StimulatorEvent
      ofType(StimulatorEvent),
      // Dále pouze takový, který obsahuje informaci o stavu stimulátoru
      filter((event: StimulatorEvent) => event.data.name === StimulatorIoChangeData.name),
      // Event musí mít commandID = 0
      filter((event: StimulatorEvent) => event.commandID === 0),
      // Vytáhnu data z události
      map((event: StimulatorEvent) => event.data),
      // Přemapuji událost na příkazy pro odeslání nového stavu jak IPC klientovi
      // tak i všem webovým klientům
      map((data: StimulatorIoChangeData) => new SendStimulatorIoDataToClientCommand(data)),
      // V případě, že se vyskytne chyba
      catchError((err, caught) => {
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
