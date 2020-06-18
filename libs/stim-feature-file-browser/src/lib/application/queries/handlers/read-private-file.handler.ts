import { IQueryHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../../domain/service/file-browser.service';

import { ReadPrivateJSONFileQuery } from '../impl/read-private-json-file.query';

export class ReadPrivateJSONFileHandler
  implements IQueryHandler<ReadPrivateJSONFileQuery> {
  constructor(private readonly service: FileBrowserService) {}

  async execute(query: any): Promise<any> {
    const path = this.service.mergePrivatePath();
    return JSON.parse(
      this.service.readFileBuffer(path, { encoding: 'utf-8' }) as string
    );
  }
}
