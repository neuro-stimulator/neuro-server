import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentAssets } from '@stechy1/diplomka-share';
import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';

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

    handler = testingModule.get<ExperimentMultimediaHandler>(ExperimentMultimediaHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('positive - should find multimedia for experiment', async () => {
    const experimentID = 1;
    const userID = 0;
    const query = new ExperimentMultimediaQuery(experimentID, userID);
    const expected: ExperimentAssets = { audio: {}, image: {} };

    service.usedOutputMultimedia.mockReturnValue(expected);

    const result = await handler.execute(query);

    expect(result).toBe(expected);
  });

  it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
    const experimentID = -1;
    const userID = 0;
    const query = new ExperimentMultimediaQuery(-1, userID);

    service.usedOutputMultimedia.mockImplementation(() => {
      throw new ExperimentIdNotFoundException(experimentID);
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'ExperimentIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
