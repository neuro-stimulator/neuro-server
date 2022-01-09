export type Predicate<L, R = L> = (lhs: L, rhs: R) => boolean;

export type PredicateMap<T> = { [key in keyof Partial<T>]: Predicate<unknown> }
