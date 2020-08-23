import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';
import { SequenceIdNotFoundException } from '@diplomka-backend/stim-feature-sequences/domain';

import { MockType } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceByIdHandler } from './sequence-by-id.handler';
import { SequenceByIdQuery } from '../impl/sequence-by-id.query';

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

    handler = testingModule.get<SequenceByIdHandler>(SequenceByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
  });

  it('positive - should find sequence by id', async () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userID = 0;
    const query = new SequenceByIdQuery(sequence.id, userID);

    service.byId.mockReturnValue(sequence);

    const result = await handler.execute(query);

    expect(result).toEqual(sequence);
  });

  it('negative - should throw exception when sequence not found', async (done: DoneCallback) => {
    const sequenceID = -1;
    const userID = 0;
    const query = new SequenceByIdQuery(sequenceID, userID);

    service.byId.mockImplementation(() => {
      throw new SequenceIdNotFoundException(sequenceID);
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'SequenceIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof SequenceIdNotFoundException) {
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
