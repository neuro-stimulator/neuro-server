import { matcherHint, printReceived, stringify } from 'jest-matcher-utils';

import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;

const passMessage = (received, argument, _) => () => {
  return `${matcherHint('.toMatchStimulatorState')}

  Stimulator state match expected value:
  ${printReceived(received)}`;
};

const failMessage = (received, argument, problemKey) => () => {
  return `${matcherHint('.toMatchStimulatorState')}
  Experiment's property '${problemKey}' does not match.
  \treceived: ${stringify(received[problemKey])}
  \texpected: ${stringify(argument[problemKey])}`;
};

expect.extend({
  toMatchStimulatorStateType(received: jest.stimulator.StimulatorStateDataType, argument: jest.stimulator.StimulatorStateDataValues): CustomMatcherResult {
    const passing = true;

    expect(received).toEqual(
      expect.objectContaining(argument)
    );

    const func = passing ? passMessage : failMessage;

    return {
      pass: passing,
      message: func(received, argument, null),
    };
  }
})
