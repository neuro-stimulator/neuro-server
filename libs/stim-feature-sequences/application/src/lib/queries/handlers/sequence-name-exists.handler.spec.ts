import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceNameExistsQuery } from '../impl/sequence-name-exists.query';
import { SequenceNameExistsHandler } from './sequence-name-exists.handler';

describe('SequenceNameExistsHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceNameExistsHandler;
  let service: MockType<SequencesService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceNameExistsHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<SequenceNameExistsHandler>(SequenceNameExistsHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
  });

  it('positive - sequence name does not exists', async () => {
    const name = 'test';
    const sequenceID = 1;
    const query = new SequenceNameExistsQuery(name, sequenceID);

    service.nameExists.mockReturnValue(false);

    const result = await handler.execute(query);

    expect(result).toBeFalsy();
  });

  it('negative - sequence name exists', async () => {
    const name = 'test';
    const sequenceID = 1;
    const query = new SequenceNameExistsQuery(name, sequenceID);

    service.nameExists.mockReturnValue(true);

    const result = await handler.execute(query);

    expect(result).toBeTruthy();
  });
});
