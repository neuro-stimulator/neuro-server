import { ReadStream } from 'fs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultDataQuery } from '../impl/experiment-result-data.query';

@QueryHandler(ExperimentResultDataQuery)
export class ExperimentResultDataHandler implements IQueryHandler<ExperimentResultDataQuery, ReadStream | string> {
  constructor(private readonly service: ExperimentResultsService, private readonly facade: FileBrowserFacade) {}

  async execute(query: ExperimentResultDataQuery): Promise<any> {
    // Získám výsledek experimentu
    const experimentResult: ExperimentResult = await this.service.byId(query.experimentResultID);
    // Z něj si vezmu název souboru
    const fileName = experimentResult.filename;
    // Spojím dohromady cestu k privátním souborům stimulátoru a názvu souboru
    const path = `${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}/${fileName}`;
    // Vrátím obsah souboru, nebo cestu (v závislosti na systému)
    return this.facade.readPrivateJSONFile(path);
  }
}
