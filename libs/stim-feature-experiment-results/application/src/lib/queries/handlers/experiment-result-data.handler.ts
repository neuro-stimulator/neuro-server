import { ReadStream } from 'fs';

import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ReadPrivateJSONFileQuery } from '@neuro-server/stim-feature-file-browser/application';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultDataQuery } from '../impl/experiment-result-data.query';

@QueryHandler(ExperimentResultDataQuery)
export class ExperimentResultDataHandler implements IQueryHandler<ExperimentResultDataQuery, ReadStream | string> {
  constructor(private readonly service: ExperimentResultsService, private readonly queryBus: QueryBus) {}

  async execute(query: ExperimentResultDataQuery): Promise<ReadStream | string> {
    // Získám výsledek experimentu
    const experimentResult: ExperimentResult = await this.service.byId(query.userGroups, query.experimentResultID);
    // Z něj si vezmu název souboru
    const fileName = experimentResult.filename;
    // Spojím dohromady cestu k privátním souborům stimulátoru a názvu souboru
    const path = `${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}/${fileName}`;
    // Vrátím obsah souboru, nebo cestu (v závislosti na systému)
    return this.queryBus.execute(new ReadPrivateJSONFileQuery(path));
  }
}
