import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentAssets } from '@stechy1/diplomka-share';

import { ExperimentIdNotFoundException } from '@neuro-server/stim-feature-experiments/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentsService } from '../../services/experiments.service';
import { createExperimentsServiceMock } from '../../services/experiments.service.jest';
import { ExperimentMultimediaQuery } from '../impl/experiment-multimedia.query';
import { ExperimentMultimediaHandler } from './experiment-multimedia.handler';

describe('ExperimentMultimedia', () => {
  let testingModule: TestingModule;
  let handler: ExperimentMultimediaHandler;
  let service: MockType<ExperimentsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentMultimediaHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentMultimediaHandler>(ExperimentMultimediaHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('positive - should find multimedia for experiment', async () => {
    const experimentID = 1;
    const userGroups = [1];
    const query = new ExperimentMultimediaQuery(userGroups, experimentID);
    const expected: ExperimentAssets = { audio: {}, image: {} };

    service.usedOutputMultimedia.mockReturnValue(expected);

    const result = await handler.execute(query);

    expect(result).toBe(expected);
  });

  it('negative - should throw exception when experiment not found', () => {
    const experimentID = -1;
    const userGroups = [1];
    const query = new ExperimentMultimediaQuery(userGroups, -1);

    service.usedOutputMultimedia.mockImplementation(() => {
      throw new ExperimentIdNotFoundException(experimentID);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new ExperimentIdNotFoundException(experimentID));
  });
});
