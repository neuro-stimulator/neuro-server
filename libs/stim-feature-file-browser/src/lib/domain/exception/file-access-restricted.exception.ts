export class FileAccessRestrictedException extends Error {
  constructor(public readonly restrictedPath: string) {
    super();
  }
}
