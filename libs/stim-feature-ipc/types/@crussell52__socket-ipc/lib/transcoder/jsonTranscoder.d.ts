import { MessageWrapper } from '../message-wrapper';

export const socketEncoding = 'utf8';

export function createEncoder(): (
  msgWrapper: MessageWrapper,
  cb: (err: Error, text: string) => void
) => void;

export function createDecoder(): (
  chunk: any,
  cb: (err: Error, text: string) => void
) => void;
