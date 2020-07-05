import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { Experiment, ExperimentERP, ExperimentType } from '@stechy1/diplomka-share';

// tslint:disable-next-line:nx-enforce-module-boundaries
import { ExperimentByIdQuery } from '@diplomka-backend/stim-feature-experiments';

import { ExperimentDoNotSupportSequencesError } from '../../../domain/exception/experiment-do-not-support-sequences.error';
import { InvalidSequenceSizeException } from '../../../domain/exception/invalid-sequence-size.exception';
import { generateSequence } from '../../../domain/services/sequences-generator';
import { SequenceWasGeneratedEvent } from '../../event/impl/sequence-was-generated.event';
import { SequenceGenerateCommand } from '../impl/sequence-generate.command';

@CommandHandler(SequenceGenerateCommand)
export class SequenceGenerateHandler implements ICommandHandler<SequenceGenerateCommand, number[]> {
  private readonly logger: Logger = new Logger(SequenceGenerateHandler.name);

  constructor(private readonly queryBus: QueryBus, private readonly eventBus: EventBus) {}

  async execute(command: SequenceGenerateCommand): Promise<number[]> {
    this.logger.debug('Budu generovat sekvenci na základě experimentu.');
    this.logger.debug('1. Získám instanci experimentu.');
    // Získám instanci experimentu
    const experiment: Experiment = await this.queryBus.execute(new ExperimentByIdQuery(command.experimentID));
    this.logger.debug(`{experiment=${experiment}}`);
    // Ověřím, že se jedná o experiment, který podporuje sekvence
    if (experiment.type !== ExperimentType.ERP) {
      // Vyhodím vyjímku a dál už nebudu pokračovat
      throw new ExperimentDoNotSupportSequencesError(command.experimentID);
    }

    if (command.sequenceSize <= 0) {
      throw new InvalidSequenceSizeException(command.sequenceSize);
    }

    this.logger.debug('2. Na základě dat z experimentu budu generovat sekvenci.');
    // Nechám vygenerovat sekvenci, kterou nakonec i vrátím
    // TODO chytře zabránit nekonečnému čekání na generování sekvence
    const sequenceData: number[] = await generateSequence(experiment as ExperimentERP, command.sequenceSize);
    this.logger.debug(`Vygenerovaná sekvence: [${sequenceData.join(',')}]`);
    // Zvěřejním událost, že byla vygenerována nová sekvence
    this.eventBus.publish(new SequenceWasGeneratedEvent(sequenceData));
    // Nakonec vrátím vygenerovaná data sekvence
    return sequenceData;
  }
}
