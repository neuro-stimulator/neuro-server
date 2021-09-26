import { Logger } from '@nestjs/common';

import { CommandToStimulator, Experiment, Output } from '@stechy1/diplomka-share';

import { SerializedExperiment } from '../interfaces';

export abstract class ExperimentProtocol {

  protected serializedExperiment: SerializedExperiment;

  protected commandID: number;

  protected constructor(protected readonly logger: Logger, protected readonly experiment?: Experiment<Output>) {}

  /**
   * Vrátí serializovaný experiment
   *
   * @param commandID Číslo příkazu packetu
   * @param sequenceSize Pokud experiment podporuje sekvence, dostane i její délku
   */
  public encodeExperiment(commandID: number, sequenceSize?: number): Buffer {
    this.initializeEncoder();

    this.writeHeader(commandID);
    this.writeExperimentBody(sequenceSize);
    this.writeTail();

    return this.serializeExperiment();
  }

  public decodeExperiment<T extends Experiment<Output>>(buffer: Buffer): T {
    const experiment = this.createEmptyExperiment() as unknown as T;
    this.initializeDecoder(buffer);

    this.readHeader(experiment);
    this.readExperimentBody(experiment);
    this.readTail(experiment);

    return experiment;
  }

  protected abstract createEmptyExperiment<T extends Experiment<Output>>(): T;

  /**
   * Inicializuje interní strukturu pro serializaci experimentu
   */
  protected initializeEncoder() {
    this.serializedExperiment = {
      offset: 0,
      experiment: Buffer.alloc(256, 0),
      outputs: [],
    };
  }

  /**
   * Inicializuje interní strukturu pro deserializaci experimentu
   *
   * @param buffer Buffer se serializovaným experimentem
   */
  protected initializeDecoder(buffer: Buffer) {
    this.serializedExperiment = {
      offset: 0,
      experiment: buffer,
      outputs: []
    }
  }

  /**
   * Zapíše hlavičku packetu s experimentem
   *
   * @param commandID Číslo příkazu packetu
   */
  protected writeHeader(commandID: number): void {
    this.commandID = commandID;
    this.serializedExperiment.experiment.writeUInt8(commandID, this.serializedExperiment.offset++);
    this.serializedExperiment.experiment.writeUInt8(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT, this.serializedExperiment.offset++);
    this.serializedExperiment.experiment.writeUInt8(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD, this.serializedExperiment.offset++);
    // 1. parametr příkazu reprezentuje typ experimentu, aby bylo dále možné
    // rozlišit, jaké parametry se budou nastavovat
    this.serializedExperiment.experiment.writeUInt8(this.experiment.type, this.serializedExperiment.offset++);
    // 2. parametr příkazu reprezentuje počet použitých výstupů v experimentu
    this.serializedExperiment.experiment.writeUInt8(this.experiment.outputCount, this.serializedExperiment.offset++);
  }

  protected readHeader(experiment: Experiment<Output>): void {
    // Přeskočím commandID, typ a třídu packetu
    this.serializedExperiment.offset += 3;
    // Přečtu 1. parametr příkazu = typ experimentu
    experiment.type = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
    // Přečtu 2. parametr příkazu = počet použitých výstupů v experimentu
    experiment.outputCount = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
  }

  /**
   * Serializuje tělo experimentu
   *
   * @param sequenceSize Pokud experiment podporuje sekvence, dostane i její délku
   */
  protected abstract writeExperimentBody(sequenceSize?: number): void;

  /**
   * Deseriailzuje tělo exprerimentu
   *
   * @param experiment Výstupní struktura experimentu
   */
  protected abstract readExperimentBody<T extends Experiment<Output>>(experiment: T): void;

  /**
   * Zmerguje serializované výstupy do bufferu s experimentem
   */
  protected writeTail(): void {
    // Nakonec přidám oddělovací znak
    this.serializedExperiment.experiment.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, this.serializedExperiment.offset++);

    // Založím výslednou proměnou se serializovaným experimentem
    const output = this.serializedExperiment.experiment;
    // Pokud experiment obsahuje nastavení výstupů
    if (this.serializedExperiment.outputs.length > 0) {
      for (const serializedOutput of this.serializedExperiment.outputs) {
        serializedOutput.output.copy(output, this.serializedExperiment.offset, 0, serializedOutput.offset);
        this.serializedExperiment.offset += serializedOutput.offset;
      }
    }
  }

  /**
   * Načte dodatečné informace do struktury experimentu
   *
   * @param experiment Výstupní struktura experimentu
   */
  protected readTail<T extends Experiment<Output>>(experiment: T): void {
    // do nothing
  }

  /**
   * Vrátí buffer se serializovaným experimentem
   */
  protected serializeExperiment(): Buffer {
    return this.serializedExperiment.experiment.slice(0, this.serializedExperiment.offset);
  }
}

