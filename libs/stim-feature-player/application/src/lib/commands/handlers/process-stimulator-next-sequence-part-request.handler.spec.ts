import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { StimulatorNextSequencePartData } from '@neuro-server/stim-feature-stimulator/domain';
import { SequenceNextPartCommand } from '@neuro-server/stim-feature-stimulator/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { ProcessStimulatorNextSequencePartRequestCommand } from '../impl/process-stimulator-next-sequence-part-request.command';
import { ProcessStimulatorNextSequencePartRequestHandler } from './process-stimulator-next-sequence-part-request.handler';

describe('ProcessStimulatorNextSequencePartRequestHandler', () => {
  let testingModule: TestingModule;
  let handler: ProcessStimulatorNextSequencePartRequestHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ProcessStimulatorNextSequencePartRequestHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ProcessStimulatorNextSequencePartRequestHandler>(ProcessStimulatorNextSequencePartRequestHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call next sequence part command', async () => {
    const offset = 1;
    const index = 10;
    const buffer = Buffer.from([1, 0, 10, 0, 0, 0, 0]);
    const data: StimulatorNextSequencePartData = new StimulatorNextSequencePartData(buffer, 0);
    const sequence: Sequence = createEmptySequence();
    const command = new ProcessStimulatorNextSequencePartRequestCommand(data);

    Object.defineProperty(service, 'sequence', {
      get: jest.fn(() => sequence),
    });

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new SequenceNextPartCommand(sequence, offset, index));
  });

});
