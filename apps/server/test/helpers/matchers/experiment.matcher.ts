import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;

import { Experiment, Output, outputTypeFromRaw } from '@stechy1/diplomka-share';

import { ExperimentEntity } from '@neuro-server/stim-feature-experiments/domain';

expect.extend({
  toMatchExperiment(received: Experiment<Output>[], argument: ExperimentEntity[]): CustomMatcherResult {
    expect(received).toHaveLength(argument.length);

    const count = received.length;

    for (let i = 0; i < count; i++) {
      const receivedExperiment: Experiment<Output> = received[i];
      const expectedExperiment: ExperimentEntity = argument[i];

      expect(receivedExperiment).toEqual(
        expect.objectContaining({
          name: expectedExperiment.name,
          description: expectedExperiment.description,
          outputCount: expectedExperiment.outputCount,
          created: expectedExperiment.created,
          tags: JSON.parse(expectedExperiment.tags),
          supportSequences: expectedExperiment.supportSequences,
          type: expectedExperiment.type,
          outputs: [],
          usedOutputs: outputTypeFromRaw(expectedExperiment.usedOutputs),
        } as Experiment<Output>)
      );
    }

    return {
      message: () => 'Experiment passing',
      pass: true,
    };
  },
});
