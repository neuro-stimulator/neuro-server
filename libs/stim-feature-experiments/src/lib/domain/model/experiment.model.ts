import { AggregateRoot } from '@nestjs/cqrs';

import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentWasCreatedEvent } from '../../application/event/impl/experiment-was-created.event';

export class ExperimentModel extends AggregateRoot {
  private _experiment: Experiment;

  private constructor() {
    super();
  }

  // public static insert(experiment: Experiment): ExperimentModel {
  //   const model = new ExperimentModel();
  //   console.log('Static insert');
  //   model.apply(new ExperimentWasCreatedEvent(experiment));
  //
  //   console.log(model);
  //   return model;
  // }

  get experiment(): Experiment {
    return this._experiment;
  }

  private onExperimentWasCreated(event: ExperimentWasCreatedEvent) {
    this._experiment = event.experiment;
  }
}
