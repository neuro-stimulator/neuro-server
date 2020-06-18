export class ContentWasNotWrittenException extends Error {
  constructor(public readonly path: string, public readonly content: any) {
    super();
  }
}
