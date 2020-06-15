export class FolderIsUnableToCreateException extends Error {
  constructor(public readonly path: string) {
    super();
  }
}
