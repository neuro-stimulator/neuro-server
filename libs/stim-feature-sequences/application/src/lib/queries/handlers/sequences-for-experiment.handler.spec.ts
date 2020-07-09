import { Test, TestingModule } from '@nestjs/testing';

import { Experiment } from '@stechy1/diplomka-share';

import { MockType } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequencesForExperimentQuery } from '../impl/sequences-for-experiment.query';
import { SequencesForExperimentHandler } from './sequences-for-experiment.handler';

describe('SequencesForExperimentHandler', () => {
  let testingModule: TestingModule;
  let handler: SequencesForExperimentHandler;
  let service: MockType<SequencesService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequencesForExperimentHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<SequencesForExperimentHandler>(SequencesForExperimentHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
  });

  it('positive - should find all sequences for selected experiment', async () => {
    const experimentID = 1;
    const experiments: Experiment[] = [];
    const query = new SequencesForExperimentQuery(experimentID);

    service.findAll.mockReturnValue(experiments);

    const result = await handler.execute(query);

    expect(result).toEqual(experiments);
  });
});
