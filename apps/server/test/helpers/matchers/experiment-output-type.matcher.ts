import { ExperimentOutputEntity } from '@neuro-server/stim-feature-experiments/domain';

import { outputType, PredicateMap, standardPredicate } from './predicates';
import { matcherHint, printReceived, stringify } from 'jest-matcher-utils';

const passMessage = (received, argument, _) => () => {
  return `${matcherHint('.toMatchExperimentOutput')}

  Output match all expected values:
  ${printReceived(received)}`;
};

const failMessage = (received, argument, problemKey) => () => {
  return `${matcherHint('.toMatchExperimentOutput')}
  Output's property '${problemKey}' does not match.
  \treceived: ${stringify(received[problemKey])}
  \texpected: ${stringify(argument[problemKey])}`;
};

const specialTransforms: Record<string, (input: unknown) => unknown> = {};

const specialPredicates: PredicateMap<jest.experiments.ExperimentOutputType> = {
  outputType: outputType
};

expect.extend({
  toMatchExperimentOutputType(received: jest.experiments.ExperimentOutputType, argument: ExperimentOutputEntity): jest.CustomMatcherResult {
    const restrictedKeys = ['id', 'audioFile', 'imageFile'];
    const keys = Object.keys(argument).filter((value) => !restrictedKeys.includes(value));

    let passing = true;
    let problemKey = null;

    for (const key of keys) {
      let predicate = standardPredicate;
      if (specialPredicates[key]) {
        predicate = specialPredicates[key];
      }
      if (!predicate(received[key], argument[key])) {
        passing = false;
        problemKey = key;
        break;
      }
    }

    let func = passing ? passMessage : failMessage;

    return {
      pass: passing,
      message: func(received, argument, problemKey),
    };
  },
});
