import { matcherHint, printReceived, stringify } from 'jest-matcher-utils';

import { PredicateMap, standardPredicate, usedOutputs, userGroups } from './predicates';

const passMessage = (received, argument, _) => () => {
  return `${matcherHint('.toMatchExperimentType')}

  Experiment match all expected values:
  ${printReceived(received)}`;
};

const failMessage = (received, argument, problemKey) => () => {
  return `${matcherHint('.toMatchExperimentType')}
  Experiment's property '${problemKey}' does not match.
  \treceived: ${stringify(received[problemKey])}
  \texpected: ${stringify(argument[problemKey])}`;
};

const specialPredicates: PredicateMap<jest.experiments.ExperimentType> = {
  usedOutputs: usedOutputs,
  userGroups: userGroups
};

expect.extend({
  toMatchExperimentType(received: jest.experiments.ExperimentType, argument: jest.experiments.ExperimentEntityFullType): jest.CustomMatcherResult {
    const restrictedKeys = ['id', 'userId', 'audioFile', 'imageFile', 'outputs'];
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

    const func = passing ? passMessage : failMessage;

    return {
      pass: passing,
      message: func(received, argument, problemKey),
    };
  },
});
