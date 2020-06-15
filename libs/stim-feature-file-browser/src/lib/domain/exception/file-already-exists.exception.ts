export class FileAlreadyExistsException extends Error {
  constructor(public readonly path: string) {
    super();
  }
}
