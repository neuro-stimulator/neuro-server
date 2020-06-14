import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentsAllQuery } from '../impl/experiments-all.query';
import { ExperimentsService } from '../../../domain/services/experiments.service';

@QueryHandler(ExperimentsAllQuery)
export class ExperimentsAllHandler
  implements IQueryHandler<ExperimentsAllQuery> {
  constructor(private readonly service: ExperimentsService) {}

  execute(query: ExperimentsAllQuery): Promise<any> {
    return this.service.findAll();
  }
}
