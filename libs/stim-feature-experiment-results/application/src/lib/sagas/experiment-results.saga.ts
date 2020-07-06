import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { StimulatorEvent, StimulatorIoChangeData} from '@diplomka-backend/stim-feature-stimulator';

import { AppendExperimentResultDataCommand } from '../commands/impl/append-experiment-result-data.command';

@Injectable()
export class ExperimentResultsSaga {
  private readonly logger: Logger = new Logger(ExperimentResultsSaga.name);

  // @Saga()
  // stimulatorStateEvent$ = (events$: Observable<any>): Observable<ICommand> => {
  //   return events$.pipe(
  //     // Zajímá mě pouze StimulatorEvent
  //     ofType(StimulatorEvent),
  //     // Dále pouze takový, který obsahuje informaci o stavu stimulátoru
  //     filter((event: StimulatorEvent) => event.data.name === StimulatorStateData.name),
  //     // Event musí mít commandID = 0
  //     filter((event: StimulatorEvent) => event.commandID === 0),
  //     // Vytáhnu data z události
  //     map((event: StimulatorEvent) => event.data),
  //     // Přemapuji událost na příkaz pro založení nového výsledku experimentu
  //     map((data: StimulatorStateData) => {
  //       switch (data.state) {
  //         case CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED:
  //           return [new ExperimentResultInitializeCommand(data.timestamp)];
  //         case CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED:
  //           return [new WriteExperimentResultToFileCommand(), new ExperimentResultInsertCommand()];
  //         case CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED:
  //           return [new ExperimentResultClearCommand()];
  //         default:
  //           return [];
  //       }
  //     }),
  //     flatMap((actions) => actions),
  //     catchError((err, caught) => {
  //       this.logger.error('Nastala chyba při reakci na změnu stavu stimulátoru!');
  //       this.logger.error(err);
  //       this.logger.error(caught);
  //       return EMPTY;
  //     })
  //   );
  // };

  @Saga()
  stimulatorIOEvent$ = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(StimulatorEvent),
      filter((event: StimulatorEvent) => event.data.name === StimulatorIoChangeData.name),
      // Event musí mít commandID = 0
      filter((event: StimulatorEvent) => event.commandID === 0),
      map((event: StimulatorEvent) => event.data),
      map((data: StimulatorIoChangeData) => {
        return new AppendExperimentResultDataCommand(data);
      }),
      catchError((err, caught) => {
        this.logger.error('Nastala chyba při zpracování IO dat ze stimulátoru!');
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
