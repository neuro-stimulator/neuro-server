import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { commandBusProvider, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceFromExperimentCommand } from '../impl/sequence-from-experiment.command';
import { SequenceFromExperimentHandler } from './sequence-from-experiment.handler';

describe('SequenceFromExperimentHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceFromExperimentHandler;
  let service: MockType<SequencesService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceFromExperimentHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<SequenceFromExperimentHandler>(SequenceFromExperimentHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should generate sequence with data from name and size', async () => {
    const experimentID = 1;
    const name = 'name';
    const size = 10;
    const sequenceData: number[] = [];
    const sequenceID = 1;
    const userID = 0;
    const query = new SequenceFromExperimentCommand(experimentID, name, size, userID);

    commandBus.execute.mockReturnValueOnce(sequenceData);
    commandBus.execute.mockReturnValueOnce(sequenceID);

    const result = await handler.execute(query);

    expect(result).toBe(sequenceID);
  });
});
