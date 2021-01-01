import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;
import { Output } from '@stechy1/diplomka-share';

expect.extend({
  toMatchExperimentOutputs(received: Output[], argument: jest.ExperimentOutputEntityType[]): CustomMatcherResult {
    expect(received).toHaveLength(argument.length);

    const count = argument.length;

    for (let i = 0; i < count; i++) {
      expect(received[i]).toMatchExperimentOutputType(argument[i]);
    }

    return {
      message: () => 'Output passing',
      pass: true,
    };
  },
});
