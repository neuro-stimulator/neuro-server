export class FileNotFoundException extends Error {
  constructor(public readonly path: string) {
    super();
  }
}
