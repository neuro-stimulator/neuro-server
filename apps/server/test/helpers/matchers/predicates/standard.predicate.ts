import { Predicate } from './predicate';

export const standardPredicate: Predicate<unknown> = (lhs, rhs) => lhs === rhs;
