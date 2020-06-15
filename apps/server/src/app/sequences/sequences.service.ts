import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';

import { FindManyOptions } from 'typeorm';
import { Validator, ValidatorResult } from 'jsonschema';

import { Experiment, ExperimentType, Sequence } from '@stechy1/diplomka-share';

import { MessagePublisher } from '../share/utils';
import { ExperimentsService } from 'libs/stim-feature-experiments/src/lib/domain/services/experiments.service';
import {
  SEQUENCE_DELETE,
  SEQUENCE_INSERT,
  SEQUENCE_UPDATE,
} from './sequences.gateway.protocol';
import { SequenceRepository } from './repository/sequence.repository';
import { SequenceEntity } from './entity/sequence.entity';

@Injectable()
export class SequencesService implements MessagePublisher {
  private static readonly JSON_SCHEMA = JSON.parse(
    fs.readFileSync('apps/server/schemas/sequence.json', { encoding: 'utf-8' })
  );

  private readonly logger: Logger = new Logger(SequencesService.name);
  private readonly _validator: Validator = new Validator();

  private _publishMessage: (topic: string, data: any) => void;

  constructor(
    private readonly _repository: SequenceRepository,
    private readonly _experimentsService: ExperimentsService
  ) {}

  async findAll(
    options?: FindManyOptions<SequenceEntity>
  ): Promise<Sequence[]> {
    this.logger.log(
      `Hledám všechny sequence s filtrem: '${JSON.stringify(
        options ? options.where : {}
      )}'.`
    );
    const sequenceResults: Sequence[] = await this._repository.all(options);
    this.logger.log(`Bylo nalezeno: ${sequenceResults.length} záznamů.`);
    return sequenceResults;
  }

  async byId(id: number): Promise<Sequence> {
    this.logger.log(`Hledám sequenci s id: ${id}`);
    const sequenceResult = await this._repository.one(id);
    if (sequenceResult === undefined) {
      return undefined;
    }
    return sequenceResult;
  }

  async insert(sequenceResult: Sequence): Promise<Sequence> {
    this.logger.log('Vkládám novou sequenci do databáze.');
    const result = await this._repository.insert(sequenceResult);
    sequenceResult.id = result.raw;

    const finalExperiment = await this.byId(sequenceResult.id);
    this._publishMessage(SEQUENCE_INSERT, finalExperiment);
    return finalExperiment;
  }

  async update(sequenceResult: Sequence): Promise<Sequence> {
    const originalExperiment = await this.byId(sequenceResult.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji sequenci.');
    const result = await this._repository.update(sequenceResult);

    const finalExperiment = await this.byId(sequenceResult.id);
    this._publishMessage(SEQUENCE_UPDATE, finalExperiment);
    return finalExperiment;
  }

  async delete(id: number): Promise<Sequence> {
    const sequence = await this.byId(id);
    if (sequence === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu sequenci s id: ${id}`);
    const result = await this._repository.delete(id);

    this._publishMessage(SEQUENCE_DELETE, sequence);
    return sequence;
  }

  async experimentsAsSequenceSource(): Promise<Experiment[]> {
    this.logger.log(
      'Hledám všechny experimenty, které můžou sloužit jako zdroj sequence.'
    );
    return await this._experimentsService.findAll({
      where: { type: ExperimentType[ExperimentType.ERP] },
    });
  }

  async validateSequence(sequence: Sequence): Promise<boolean> {
    this.logger.log('Validuji sekvenci.');
    const result: ValidatorResult = this._validator.validate(
      sequence,
      SequencesService.JSON_SCHEMA
    );
    this.logger.log(`Je sekvence validní: ${result.valid}.`);
    if (!result.valid) {
      this.logger.debug(result.errors);
    }
    return result.valid;
  }

  async nameExists(name: string, id: number | 'new'): Promise<boolean> {
    if (id === 'new') {
      this.logger.log(
        `Testuji, zda-li zadaný název nové sekvence již existuje: ${name}.`
      );
    } else {
      this.logger.log(
        `Testuji, zda-li zadaný název pro existující sekvenci již existuje: ${name}.`
      );
    }
    const exists = await this._repository.nameExists(name, id);
    this.logger.log(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }

  registerMessagePublisher(
    messagePublisher: (topic: string, data: any) => void
  ) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }
}