import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { SequenceIdNotFoundException } from '@neuro-server/stim-feature-sequences/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceByIdQuery } from '../impl/sequence-by-id.query';
import { SequenceByIdHandler } from './sequence-by-id.handler';

describe('SequenceByIdHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceByIdHandler;
  let service: MockType<SequencesService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceByIdHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SequenceByIdHandler>(SequenceByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
  });

  it('positive - should find sequence by id', async () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userGroups = [1];
    const query = new SequenceByIdQuery(userGroups, sequence.id);

    service.byId.mockReturnValue(sequence);

    const result = await handler.execute(query);

    expect(result).toEqual(sequence);
  });

  it('negative - should throw exception when sequence not found', () => {
    const sequenceID = -1;
    const userGroups = [1];
    const query = new SequenceByIdQuery(userGroups, sequenceID);

    service.byId.mockImplementation(() => {
      throw new SequenceIdNotFoundException(sequenceID);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new SequenceIdNotFoundException(sequenceID));
  });
});
