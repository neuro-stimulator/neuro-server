import { MessageWrapper } from 'apps/server/types/@crussell52__socket-ipc/lib/message-wrapper';

export class DecodeError extends Error {
  /**
   * @param errorMessage - A description of what happened.
   * @param rawData - The data which failed to decode.
   */
  constructor(errorMessage: string, rawData: any);
}

export class SendError extends Error {
  /**
   * @param errorMessage - A description of what went wrong.
   * @param message - The message being sent.
   * @param topic - The topic of the message being sent.
   */
  constructor(errorMessage: string, message: any, topic: string);
}

/**
 * Indicates that an error happened during the encoding phase of sending a message.
 */
export class EncodeError extends SendError {
  /**
   * @param errorMessage - A description of what went wrong.
   * @param msgWrapper - The message being sent and its topic.
   */
  constructor(errorMessage: string, msgWrapper: MessageWrapper);
}

export class SendAfterCloseError extends SendError { }

export class NoServerError extends SendError { }

export class BadClientError extends SendError {
  /**
   * @param errorMessage - A description of what went wrong.
   * @param message - The message being sent.
   * @param topic - The topic of the message being sent.
   * @param clientId - The client id which is invalid.
   */
  constructor(errorMessage: string, message: any, topic: string, clientId: string);
}

// module.exports = {
//   EncodeError, DecodeError, SendError, SendAfterCloseError, NoServerError, BadClientError
// };
