import { OutputType, outputTypeToRaw } from '@stechy1/diplomka-share';

import { Predicate } from './predicate';

export const usedOutputs: Predicate<OutputType, number> = (lhs: OutputType, rhs: number) => outputTypeToRaw(lhs) === rhs;
