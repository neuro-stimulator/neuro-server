import { matcherHint, printReceived, stringify } from 'jest-matcher-utils';

import { Predicate, standardPredicate, userGroups } from './predicates';

import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;

const passMessage = (received, argument, _) => () => {
  return `${matcherHint('.toMatchUserType')}

  User match all expected values:
  ${printReceived(received)}`;
};

const failMessage = (received, argument, problemKey) => () => {
  return `${matcherHint('.toMatchUserType')}
  User's property '${problemKey}' does not match.
  \treceived: ${stringify(received[problemKey])}
  \texpected: ${stringify(argument[problemKey])}`;
};

const specialPredicates: Record<keyof jest.user.UserType, Predicate<unknown>> = {
  userGroups: userGroups,

};

expect.extend({
  toMatchUserType(received: jest.user.UserType, argument: jest.user.UserEntityType): CustomMatcherResult {
    const restrictedKeys: [keyof jest.user.UserType] = ['id', 'uuid', 'lastLoginDate'];
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
  }
})
