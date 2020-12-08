import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import {
  StimulatorData,
  StimulatorIoChangeData,
  StimulatorMemoryData,
  StimulatorNextSequencePartData,
  StimulatorRequestFinishData,
  StimulatorStateData,
  UnsupportedStimulatorCommandException,
} from '@diplomka-backend/stim-feature-stimulator/domain';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { ParseStimulatorDataQuery } from '../impl/parse-stimulator-data.query';
import { ParseStimulatorDataHandler } from './parse-stimulator-data.handler';

describe('ParseStimulatorDataHandler', () => {
  let testingModule: TestingModule;
  let handler: ParseStimulatorDataHandler;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [ParseStimulatorDataHandler],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ParseStimulatorDataHandler>(ParseStimulatorDataHandler);
  });

  function buildBuffer(commandID: number, eventType: number, commandLength: number, ...data: number[]): Buffer {
    return Buffer.from([commandID, eventType, commandLength, ...data]);
  }

  it('positive - should parse stimulator state command', async () => {
    const commandID = 0;
    const eventType = CommandFromStimulator.COMMAND_STIMULATOR_STATE;
    const commandLength = 0;
    const state = CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY;
    const noUpdate = 1;
    const timestamp = [0, 0, 0, 0];
    const buffer = buildBuffer(commandID, eventType, commandLength, state, noUpdate, ...timestamp);
    const query = new ParseStimulatorDataQuery(buffer);

    const [resultComandID, resultData]: [number, StimulatorData] = await handler.execute(query);

    expect(resultComandID).toBe(commandID);
    expect(resultData).toBeInstanceOf(StimulatorStateData);
    expect((resultData as StimulatorStateData).state).toBe(state);
    expect((resultData as StimulatorStateData).noUpdate).toBeTruthy();
    expect((resultData as StimulatorStateData).timestamp).toBe(0);
  });

  it('positive - should parse output activated command', async () => {
    const commandID = 0;
    const eventType = CommandFromStimulator.COMMAND_OUTPUT_ACTIVATED;
    const commandLength = 0;
    const index = 0;
    const timestamp = [0, 0, 0, 0];
    const buffer = buildBuffer(commandID, eventType, commandLength, index, ...timestamp);
    const query = new ParseStimulatorDataQuery(buffer);

    const [resultComandID, resultData]: [number, StimulatorData] = await handler.execute(query);

    expect(resultComandID).toBe(commandID);
    expect(resultData).toBeInstanceOf(StimulatorIoChangeData);
    expect((resultData as StimulatorIoChangeData).ioType).toBe('output');
    expect((resultData as StimulatorIoChangeData).state).toBe('on');
    expect((resultData as StimulatorIoChangeData).index).toBe(index);
    expect((resultData as StimulatorIoChangeData).timestamp).toBe(0);
  });

  it('positive - should parse output deactivated command', async () => {
    const commandID = 0;
    const eventType = CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED;
    const commandLength = 0;
    const index = 0;
    const timestamp = [0, 0, 0, 0];
    const buffer = buildBuffer(commandID, eventType, commandLength, index, ...timestamp);
    const query = new ParseStimulatorDataQuery(buffer);

    const [resultComandID, resultData]: [number, StimulatorData] = await handler.execute(query);

    expect(resultComandID).toBe(commandID);
    expect(resultData).toBeInstanceOf(StimulatorIoChangeData);
    expect((resultData as StimulatorIoChangeData).ioType).toBe('output');
    expect((resultData as StimulatorIoChangeData).state).toBe('off');
    expect((resultData as StimulatorIoChangeData).index).toBe(index);
    expect((resultData as StimulatorIoChangeData).timestamp).toBe(0);
  });

  it('positive - should parse input activated command', async () => {
    const commandID = 0;
    const eventType = CommandFromStimulator.COMMAND_INPUT_ACTIVATED;
    const commandLength = 0;
    const index = 0;
    const timestamp = [0, 0, 0, 0];
    const buffer = buildBuffer(commandID, eventType, commandLength, index, ...timestamp);
    const query = new ParseStimulatorDataQuery(buffer);

    const [resultComandID, resultData]: [number, StimulatorData] = await handler.execute(query);

    expect(resultComandID).toBe(commandID);
    expect(resultData).toBeInstanceOf(StimulatorIoChangeData);
    expect((resultData as StimulatorIoChangeData).ioType).toBe('input');
    expect((resultData as StimulatorIoChangeData).state).toBe('on');
    expect((resultData as StimulatorIoChangeData).index).toBe(index);
    expect((resultData as StimulatorIoChangeData).timestamp).toBe(0);
  });

  it('positive - should parse next sequence part command', async () => {
    const commandID = 0;
    const eventType = CommandFromStimulator.COMMAND_REQUEST_SEQUENCE_NEXT_PART;
    const commandLength = 0;
    const offset = [0, 0];
    const index = 0;
    const timestamp = [0, 0, 0, 0];
    const buffer = buildBuffer(commandID, eventType, commandLength, ...offset, index, ...timestamp);
    const query = new ParseStimulatorDataQuery(buffer);

    const [resultComandID, resultData]: [number, StimulatorData] = await handler.execute(query);

    expect(resultComandID).toBe(commandID);
    expect(resultData).toBeInstanceOf(StimulatorNextSequencePartData);
    expect((resultData as StimulatorNextSequencePartData).offset).toBe(0);
    expect((resultData as StimulatorNextSequencePartData).index).toBe(0);
    expect((resultData as StimulatorNextSequencePartData).timestamp).toBe(0);
  });

  it('positive - should parse memory data command', async () => {
    const commandID = 0;
    const eventType = CommandFromStimulator.COMMAND_MEMORY;
    const commandLength = 0;
    const data = [0, 0, 0, 0];
    const buffer = buildBuffer(commandID, eventType, commandLength, ...data);
    const query = new ParseStimulatorDataQuery(buffer);

    const [resultCommandID, resultData]: [number, StimulatorData] = await handler.execute(query);

    expect(resultCommandID).toBe(commandID);
    expect(resultData).toBeInstanceOf(StimulatorMemoryData);
    expect((resultData as StimulatorMemoryData).data).toEqual(data);
  });

  it('positive - should parse stimulator finish request command', async () => {
    const commandID = 0;
    const eventType = CommandFromStimulator.COMMAND_STIMULATOR_REQUEST_FINISH;
    const commandLength = 8;
    const data = [0, 0, 0, 0];
    const buffer = buildBuffer(commandID, eventType, commandLength, ...data);
    const query = new ParseStimulatorDataQuery(buffer);

    const [resultCommandID, resultData]: [number, StimulatorData] = await handler.execute(query);

    expect(resultCommandID).toBe(commandID);
    expect(resultData).toBeInstanceOf(StimulatorRequestFinishData);
    expect((resultData as StimulatorRequestFinishData).timestamp).toEqual(0);
  });

  it('negative - should throw exception when unknown command comming', async (done: DoneCallback) => {
    const commandID = 0;
    const eventType = 255;
    const commandLength = 0;
    const buffer = buildBuffer(commandID, eventType, commandLength);
    const query = new ParseStimulatorDataQuery(buffer);

    try {
      await handler.execute(query);
      done.fail('UnsupportedStimulatorCommandException was not thrown!');
    } catch (e) {
      if (e instanceof UnsupportedStimulatorCommandException) {
        expect(e.buffer).toEqual(buffer);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
