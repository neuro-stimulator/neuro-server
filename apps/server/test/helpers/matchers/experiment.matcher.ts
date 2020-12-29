import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;

import { Experiment, Output } from '@stechy1/diplomka-share';

expect.extend({
  toMatchExperiment(received: Experiment<Output>[], argument: Experiment<Output>[]): CustomMatcherResult {
    expect(received).toHaveLength(argument.length);

    const count = received.length;

    for (let i = 0; i < count; i++) {
      expect(received[i]).toEqual(expect.objectContaining(argument[i]));
    }

    return {
      message: () => 'Experiment passing',
      pass: true,
    };
  },
});
