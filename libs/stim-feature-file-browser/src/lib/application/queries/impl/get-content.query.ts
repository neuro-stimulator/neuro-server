import { FileLocation } from '../../../domain/model/file-location';

export class GetContentQuery {
  constructor(public readonly path: string, public readonly location: FileLocation = 'public') {}
}
