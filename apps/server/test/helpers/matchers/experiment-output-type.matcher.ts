import { ExperimentOutputEntity } from '@neuro-server/stim-feature-experiments/domain';

import { PredicateMap, standardPredicate, outputType } from './predicates';
import { matcherHint, printReceived, stringify } from 'jest-matcher-utils';
import { TransformMap } from './transforms';

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

const specialTransforms: TransformMap<jest.experiments.ExperimentOutputType> = {
};

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
      let receivedValue = argument[key];
      if (specialTransforms[key]) {
        receivedValue = specialTransforms[key](received)
      }
      if (!predicate(receivedValue, argument[key])) {
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
