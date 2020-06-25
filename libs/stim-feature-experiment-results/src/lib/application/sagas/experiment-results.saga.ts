import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, flatMap, map, mergeMap } from 'rxjs/operators';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import {
  StimulatorEvent,
  StimulatorIoChangeData,
} from '@diplomka-backend/stim-feature-stimulator';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator';

import {
  AppendExperimentResultDataCommand,
  ExperimentResultInitializeCommand,
  ExperimentResultInsertCommand,
  WriteExperimentResultToFileCommand,
} from '../commands';

@Injectable()
export class ExperimentResultsSaga {
  private readonly logger: Logger = new Logger(ExperimentResultsSaga.name);
  @Saga()
  stimulatorStateEvent$ = (events$: Observable<any>): Observable<ICommand> => {
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
      mergeMap((data: StimulatorStateData) => {
        switch (data.state) {
          case CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED:
            return [new ExperimentResultInitializeCommand()];
          case CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED:
            return [
              new WriteExperimentResultToFileCommand(),
              new ExperimentResultInsertCommand(),
            ];
          default:
            return [];
        }
      }),
      // flatMap((actions) => actions),
      catchError((err, caught) => {
        this.logger.error(
          'Nastala chyba při reakci na změnu stavu stimulátoru!'
        );
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };

  @Saga()
  stimulatorIOEvent$ = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(StimulatorEvent),
      filter(
        (event: StimulatorEvent) =>
          event.data.name === StimulatorIoChangeData.name
      ),
      map((event: StimulatorEvent) => event.data),
      map((data: StimulatorIoChangeData) => {
        return new AppendExperimentResultDataCommand(data);
      }),
      catchError((err, caught) => {
        this.logger.error(
          'Nastala chyba při zpracování IO dat ze stimulátoru!'
        );
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
