import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { Experiment, ExperimentAssets, Output, outputToAudioAssetInfo, outputToImageAssetInfo } from '@stechy1/diplomka-share';

import { ObjectDiff } from '@neuro-server/stim-lib-common';

import { CustomExperimentRepository } from './custom-experiment-repository';

export abstract class BaseExperimentRepository<T extends Experiment<Output>> implements CustomExperimentRepository<T> {

  public abstract one(record: Experiment<Output>): Promise<T | undefined>;

  public abstract insert(record: T): Promise<InsertResult>;

  public abstract update(record: T, diff: ObjectDiff): Promise<UpdateResult | void>;

  public abstract delete(id: number): Promise<DeleteResult>;

  public outputMultimedia(experiment: T): ExperimentAssets {
    const multimedia: ExperimentAssets = {
      audio: {},
      image: {},
    };
    for (let i = 0; i < experiment.outputCount; i++) {
      const output = experiment.outputs[i];
      if (output.outputType.audio && output.outputType.audioFile != null) {
        multimedia.audio[i] = outputToAudioAssetInfo(output);
      }
      if (output.outputType.image && output.outputType.imageFile != null) {
        multimedia.image[i] = outputToImageAssetInfo(output);
      }
    }

    return multimedia;
  }
}
