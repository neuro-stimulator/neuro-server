import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;

import { ExperimentResult, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentResultEntity } from '@diplomka-backend/stim-feature-experiment-results/domain';

expect.extend({
  toMatchExperimentResult(received: ExperimentResult[], argument: ExperimentResultEntity[]): CustomMatcherResult {
    expect(received).toHaveLength(argument.length);

    const count = received.length;

    for (let i = 0; i < count; i++) {
      const receivedExperimentResult: ExperimentResult = received[i];
      const expectedExperimentResult: ExperimentResultEntity = argument[i];

      expect(receivedExperimentResult).toEqual(
        expect.objectContaining({
          id: expectedExperimentResult.id,
          name: expectedExperimentResult.name,
          experimentID: expectedExperimentResult.experimentID,
          date: expectedExperimentResult.date,
          type: ExperimentType[expectedExperimentResult.type],
          outputCount: expectedExperimentResult.outputCount,
          filename: expectedExperimentResult.filename
        } as ExperimentResult)
      );
    }

    return {
      message: () => 'ExperimentResult passing',
      pass: true
    };
  }
})
