import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequencesAllQuery } from '../impl/sequences-all.query';
import { SequencesAllHandler } from './sequences-all.handler';

describe('SequencesAllHandler', () => {
  let testingModule: TestingModule;
  let handler: SequencesAllHandler;
  let service: MockType<SequencesService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequencesAllHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SequencesAllHandler>(SequencesAllHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
  });

  it('positive - should get all sequences', async () => {
    const sequences: Sequence[] = [createEmptySequence()];
    const userID = 0;
    const query = new SequencesAllQuery(userID);

    service.findAll.mockReturnValue(sequences);

    const result = await handler.execute(query);

    expect(result).toEqual(sequences);
    expect(service.findAll).toBeCalledWith({ where: { userId: userID } });
  });
});
