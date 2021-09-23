import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { SequenceGenerateCommand } from '../impl/sequence-generate.command';
import { SequenceInsertCommand } from '../impl/sequence-insert.command';
import { SequenceFromExperimentCommand } from '../impl/sequence-from-experiment.command';

@CommandHandler(SequenceFromExperimentCommand)
export class SequenceFromExperimentHandler implements ICommandHandler<SequenceFromExperimentCommand, number> {
  private readonly logger: Logger = new Logger(SequenceFromExperimentHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: SequenceFromExperimentCommand): Promise<number> {
    this.logger.debug('Budu generovat novou sekvenci na základě jména a délky.');
    this.logger.debug('1. Vygeneruji data sekvence.');
    const data: number[] = await this.commandBus.execute(new SequenceGenerateCommand(command.userGroups, command.experimentID, command.size));

    this.logger.debug('2. Vytvořím novou instanci sekvence a naplním ji daty');
    const sequence: Sequence = createEmptySequence();
    sequence.experimentId = command.experimentID;
    sequence.name = command.name;
    sequence.size = command.size;
    sequence.data = data;
    this.logger.debug(`{sequence=${JSON.stringify(sequence)}}`);

    this.logger.debug('3. Uložím vygenerovanou sekvenci do databáze.');
    return this.commandBus.execute(new SequenceInsertCommand(command.userId, sequence));
  }
}
