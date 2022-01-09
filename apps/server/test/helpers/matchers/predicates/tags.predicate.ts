import { Predicate } from './predicate';

export const tags: Predicate<string[]> = (lhs: string[], rhs: string[]) => {
  if (lhs.length !== rhs.length) {
    return false;
  }

  lhs.sort();
  rhs.sort();

  expect(lhs).toEqual(rhs);

  return true;
}
