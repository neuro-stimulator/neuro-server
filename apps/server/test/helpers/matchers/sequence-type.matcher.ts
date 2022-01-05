import { matcherHint, printReceived, stringify } from 'jest-matcher-utils';

import { PredicateMap, standardPredicate } from './predicates/index';

const passMessage = (received, argument, _) => () => {
  return `${matcherHint('.toMatchSequenceType')}

  Sequence match all expected values:
  ${printReceived(received)}`;
};

const failMessage = (received, argument, problemKey) => () => {
  return `${matcherHint('.toMatchSequenceType')}
  Sequence's property '${problemKey}' does not match.
  \treceived: ${stringify(received[problemKey])}
  \texpected: ${stringify(argument[problemKey])}`;
};

const specialPredicates: PredicateMap<jest.sequences.SequenceType> = {
  // vyplň speciální predikáty
};

expect.extend({
  toMatchSequenceType(received: jest.sequences.SequenceType, argument: jest.sequences.SequenceEntityType): jest.CustomMatcherResult {
    const restrictedKeys = ['id', 'created',];
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
  }
})
