import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { StimulatorEvent } from '@diplomka-backend/stim-feature-stimulator/application';
import { StimulatorIoChangeData, StimulatorNextSequencePartData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { ProcessStimulatorIoDataCommand } from '../commands/impl/process-stimulator-io-data.command';
import { ProcessStimulatorNextSequencePartRequestCommand } from '../commands/impl/process-stimulator-next-sequence-part-request.command';

@Injectable()
export class PlayerSaga {
  private readonly logger: Logger = new Logger(PlayerSaga.name);

  @Saga()
  stimulatorIOEvent$ = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(StimulatorEvent),
      filter((event: StimulatorEvent) => event.data.name === StimulatorIoChangeData.name),
      // Event musí mít commandID = 0
      filter((event: StimulatorEvent) => event.commandID === 0),
      map((event: StimulatorEvent) => event.data),
      map((data: StimulatorIoChangeData) => {
        return new ProcessStimulatorIoDataCommand(data);
      }),
      catchError((err, caught) => {
        this.logger.error('Nastala chyba při zpracování IO dat ze stimulátoru!');
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };

  @Saga()
  nextSequencePartRequest$ = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(StimulatorEvent),
      filter((event: StimulatorEvent) => event.data.name === StimulatorNextSequencePartData.name),
      // Event musí mít commandID = 0
      filter((event: StimulatorEvent) => event.commandID === 0),
      map((event: StimulatorEvent) => event.data),
      map((data: StimulatorNextSequencePartData) => {
        return new ProcessStimulatorNextSequencePartRequestCommand(data);
      }),
      catchError((err, caught) => {
        this.logger.error('Nastala chyba při zpracování další části sekvence!');
        this.logger.error(err);
        this.logger.error(caught);
        return EMPTY;
      })
    );
  };
}
