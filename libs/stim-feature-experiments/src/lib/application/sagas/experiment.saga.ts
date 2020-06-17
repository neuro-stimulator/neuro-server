import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { StimulatorEvent } from '@diplomka-backend/stim-feature-stimulator';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator';
import { CommandFromStimulator } from '@stechy1/diplomka-share';

@Injectable()
export class ExperimentSaga {
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
      // Vyfiltruji pouze taková data, která obsahují inicializaci experimentu
      filter(
        (data: StimulatorStateData) =>
          data.state ===
          CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED
      )
      // Přemapuji událost na příkaz pro založení nového výsledku experimentu
      // map()
      // Událost přemapuji na data
      // map((event: StimulatorEvent) => event.data)
    );
  };
}
