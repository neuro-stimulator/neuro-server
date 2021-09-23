import { Injectable, Logger } from '@nestjs/common';


import { Sequence } from '@stechy1/diplomka-share';

import { SequenceFindOptions, SequenceIdNotFoundException, SequenceRepository } from '@diplomka-backend/stim-feature-sequences/domain';
import { jsonObjectDiff } from '@diplomka-backend/stim-lib-common';

@Injectable()
export class SequencesService {
  private readonly logger: Logger = new Logger(SequencesService.name);

  constructor(private readonly _repository: SequenceRepository) {}

  async findAll(findOptions: SequenceFindOptions): Promise<Sequence[]> {
    const sequences: Sequence[] = await this._repository.all(findOptions);
    this.logger.verbose(`Bylo nalezeno: ${sequences.length} záznamů.`);
    return sequences;
  }

  async byId(userGroups: number[], id: number): Promise<Sequence> {
    this.logger.verbose(`Hledám sequenci s id: ${id}`);
    const sequence = await this._repository.one({  userGroups: userGroups, optionalOptions: { id } });
    if (sequence === undefined) {
      this.logger.warn(`Sekvence s id: ${id} nebyla nalezena!`);
      throw new SequenceIdNotFoundException(id);
    }
    return sequence;
  }

  async insert(sequence: Sequence, userID: number): Promise<number> {
    this.logger.verbose('Vkládám novou sequenci do databáze.');
    const result = await this._repository.insert(sequence, userID);

    return result.id;
  }

  async update(userGroups: number[], sequence: Sequence): Promise<void> {
    const originalSequence = await this.byId(userGroups, sequence.id);
    const diff = jsonObjectDiff(sequence, originalSequence);
    this.logger.log(`Diff: ${JSON.stringify(diff)}`);

    this.logger.verbose('Aktualizuji sequenci.');
    const result = await this._repository.update(sequence);
  }

  async delete(id: number): Promise<void> {
    this.logger.verbose(`Mažu sequenci s id: ${id}`);
    const result = await this._repository.delete(id);
  }

  async nameExists(name: string, id: number | 'new'): Promise<boolean> {
    if (id === 'new') {
      this.logger.verbose(`Testuji, zda-li zadaný název nové sekvence již existuje: ${name}.`);
    } else {
      this.logger.verbose(`Testuji, zda-li zadaný název pro existující sekvenci již existuje: ${name}.`);
    }
    const exists = await this._repository.nameExists(name, id);
    this.logger.verbose(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }
}
