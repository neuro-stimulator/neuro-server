import { FileLocation } from '@neuro-server/stim-feature-file-browser/domain';

export class GetContentQuery {
  constructor(public readonly path: string, public readonly location: FileLocation = 'public') {}
}
