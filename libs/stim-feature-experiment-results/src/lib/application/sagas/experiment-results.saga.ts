import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { StimulatorEvent } from '@diplomka-backend/stim-feature-stimulator';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator';

import {
  ExperimentResultInitializeCommand,
  ExperimentResultInsertCommand,
} from '../commands';

@Injectable()
export class ExperimentResultsSaga {
  private readonly logger: Logger = new Logger(ExperimentResultsSaga.name);
  @Saga()
  stimulatorEvent = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      // Zajímá mě pouze StimulatorEvent
      ofType(StimulatorEvent),
      // Dále pouze takový, který obsahuje informaci o stavu stimulátoru
      filter(
        (event: StimulatorEvent) => event.data.name === StimulatorStateData.name
      ),
      // Vytáhnu data z události
      map((event: StimulatorEvent) => event.data),
      // Přemapuji událost na příkaz pro založení nového výsledku experimentu
      map((data: StimulatorStateData) => {
        switch (data.state) {
          case CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED:
            return new ExperimentResultInitializeCommand();
          case CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED:
            return new ExperimentResultInsertCommand();
        }
      }),
      catchError((err, caught) => {
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
