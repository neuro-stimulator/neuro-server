import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { ExperimentIdNotFoundError } from '@diplomka-backend/stim-feature-experiments';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { createExperimentsServiceMock } from '../../../domain/services/experiments.service.jest';
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
    const query = new ExperimentMultimediaQuery(experimentID);
    const expected = { audio: {}, image: {} };

    service.usedOutputMultimedia.mockReturnValue(expected);

    const result = await handler.execute(query);

    expect(result).toBe(expected);
  });

  it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
    const experimentID = -1;
    const query = new ExperimentMultimediaQuery(-1);

    service.usedOutputMultimedia.mockImplementation(() => {
      throw new ExperimentIdNotFoundError(experimentID);
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'ExperimentIdNotFoundError was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
