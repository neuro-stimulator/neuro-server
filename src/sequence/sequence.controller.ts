import { Controller, Get, Param } from '@nestjs/common';

import { ExperimentERP } from 'diplomka-share';

import { SequenceService } from './sequence.service';
import { ExperimentsService } from '../experiments/experiments.service';

@Controller('/api/sequence')
export class SequenceController {

  constructor(private readonly _service: SequenceService,
              private readonly _experiments: ExperimentsService) {}

  @Get('new-for-experiment/:id/:sequenceSize')
  public async generateSequenceForExperiment(@Param() params: { id: number, sequenceSize: number }) {
    const experiment = await this._experiments.byId(params.id);
    const [sequence, analyse] = await this._service.newErpSequence(experiment as ExperimentERP, params.sequenceSize);

    return {experiment, sequence, analyse};
  }

}
