import { OutputType, outputTypeToRaw } from '@stechy1/diplomka-share';

export const usedOutputs = (lhs: OutputType, rhs: number) => outputTypeToRaw(lhs) === rhs;
