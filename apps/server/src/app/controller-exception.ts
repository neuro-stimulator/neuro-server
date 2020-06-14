
export class ControllerException extends Error {

  constructor(public readonly code: number, public readonly params?: {}) {
    super();
  }

}
