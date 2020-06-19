import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import {
  StimulatorEvent,
  StimulatorStateData,
} from '@diplomka-backend/stim-feature-stimulator';

import { IpcStimulatorStateChangeCommand } from '../commands';

@Injectable()
export class StimulatorSaga {
  private readonly logger: Logger = new Logger(StimulatorSaga.name);
  @Saga()
  stimulatorEvent$ = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze StimulatorEvent
      ofType(StimulatorEvent),
      // Dále pouze takový, který obsahuje informaci o stavu stimulátoru
      filter(
        (event: StimulatorEvent) => event.data.name === StimulatorStateData.name
      ),
      // Vytáhnu data z události
      map((event: StimulatorEvent) => event.data),
      // Přemapuji událost na příkaz pro odeslání nového stavu IPC klientovi
      map((data: StimulatorStateData) => {
        return new IpcStimulatorStateChangeCommand(data.state);
      }),
      // V případě, že se vyskytne chyba
      catchError((err, caught) => {
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
