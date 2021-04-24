import { Injectable, Logger } from '@nestjs/common';

import { FindManyOptions } from 'typeorm';

import { Sequence } from '@stechy1/diplomka-share';

import { SequenceIdNotFoundException, SequenceRepository, SequenceEntity } from '@diplomka-backend/stim-feature-sequences/domain';
import { jsonObjectDiff } from '@diplomka-backend/stim-lib-common';

@Injectable()
export class SequencesService {
  private readonly logger: Logger = new Logger(SequencesService.name);

  constructor(private readonly _repository: SequenceRepository) {}

  async findAll(options?: FindManyOptions<SequenceEntity>): Promise<Sequence[]> {
    this.logger.verbose(`Hledám všechny sequence s filtrem: '${JSON.stringify(options ? options.where : {})}'.`);
    const sequences: Sequence[] = await this._repository.all(options);
    this.logger.verbose(`Bylo nalezeno: ${sequences.length} záznamů.`);
    return sequences;
  }

  async byId(id: number, userID: number): Promise<Sequence> {
    this.logger.verbose(`Hledám sequenci s id: ${id}`);
    const sequence = await this._repository.one(id, userID);
    if (sequence === undefined) {
      this.logger.warn(`Sekvence s id: ${id} nebyla nalezena!`);
      throw new SequenceIdNotFoundException(id);
    }
    return sequence;
  }

  async insert(sequence: Sequence, userID: number): Promise<number> {
    this.logger.verbose('Vkládám novou sequenci do databáze.');
    const result = await this._repository.insert(sequence, userID);

    return result.raw;
  }

  async update(sequence: Sequence, userID: number): Promise<void> {
    const originalSequence = await this.byId(<number>sequence.id, userID);
    this.logger.log(jsonObjectDiff(sequence, originalSequence));

    this.logger.verbose('Aktualizuji sequenci.');
    const result = await this._repository.update(sequence);
  }

  async delete(id: number, userID: number): Promise<void> {
    const sequence = await this.byId(id, userID);
    if (sequence === undefined) {
      return undefined;
    }

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
