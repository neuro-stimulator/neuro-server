import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable } from 'rxjs';
import { catchError, concatMap, filter, map } from 'rxjs/operators';

import { StimulatorRequestFinishData, StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

import { FirmwareFileDeleteCommand } from '../commands/impl/firmware-file-delete.command';
import { SendStimulatorStateChangeToClientCommand } from '../commands/impl/to-client/send-stimulator-state-change-to-client.command';
import { SendStimulatorStateChangeToIpcCommand } from '../commands/impl/to-ipc/send-stimulator-state-change-to-ipc.command';
import { FirmwareUpdatedEvent } from '../events/impl/firmware-updated.event';
import { StimulatorService } from '../service/stimulator.service';
import { StimulatorEvent } from '../events/impl/stimulator.event';
import { ExperimentFinishCommand } from '../commands/impl/experiment-finish.command';
import { CheckStimulatorStateConsistencyCommand } from '../commands/impl/check-stimulator-state-consistency.command';

@Injectable()
export class StimulatorSaga {
  private readonly logger: Logger = new Logger(StimulatorSaga.name);

  constructor(private readonly _service: StimulatorService) {}

  @Saga()
  firmwareUpdated$ = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(FirmwareUpdatedEvent),
      map((event: FirmwareUpdatedEvent) => new FirmwareFileDeleteCommand(event.path))
    );
  };

  @Saga()
  stimulatorStateEventRaised$ = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze StimulatorEvent
      ofType(StimulatorEvent),
      // Dále pouze takový, který obsahuje informaci o stavu stimulátoru
      filter((event: StimulatorEvent) => event.data.name === StimulatorStateData.name),
      // Event musí mít commandID = 0
      // filter((event: StimulatorEvent) => event.commandID === 0),
      // Vytáhnu data z události
      map((event: StimulatorEvent) => [event, event.data]),
      // Přemapuji událost na příkazy pro odeslání nového stavu jak IPC klientovi
      // tak i všem webovým klientům
      map(([event, data]: [StimulatorEvent, StimulatorStateData]) => {
        const commands = [new SendStimulatorStateChangeToIpcCommand(data.state)];
        if (event.commandID === 0) {
          commands.push(new SendStimulatorStateChangeToClientCommand(data.state));
          commands.push(new CheckStimulatorStateConsistencyCommand(data.state));
        }
        return commands;
      }),
      concatMap((events) => events),
      // V případě, že se vyskytne chyba
      catchError((err, caught) => {
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };

  @Saga()
  stimulatorFinishRequestEvent$ = (event$: Observable<unknown>): Observable<ICommand> => {
    return event$.pipe(
      ofType(StimulatorEvent),
      filter((event: StimulatorEvent) => event.data.name === StimulatorRequestFinishData.name),
      map(() => new ExperimentFinishCommand(this._service.currentExperimentID, true)),
      catchError((err, caught) => {
        this.logger.error('Nastala chyba při vyřizování požadavku na ukončení experimentu ze strany stimulátoru!');
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
