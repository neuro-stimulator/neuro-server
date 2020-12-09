import DoneCallback = jest.DoneCallback;

import { DtoFactory, ExperimentDtoNotFoundException } from '@diplomka-backend/stim-lib-common';

describe('DtoFactory', () => {
  let factory: DtoFactory;
  let dummyDto: DummyDto;

  beforeEach(async () => {
    factory = new DtoFactory();
    dummyDto = new DummyDto();
  });

  it('positive - should register DTO', async () => {
    const key = 'key';

    factory.registerDTO(key, DummyDto);
    expect(factory.getDTO(key)).toEqual(DummyDto);
  });

  it('negative - should throw exception when key is not found', async (done: DoneCallback) => {
    const key = 'key';

    try {
      factory.getDTO(key);
    } catch (e) {
      if (e instanceof ExperimentDtoNotFoundException) {
        done();
      } else {
        done.fail();
      }
    }
  });

  class DummyDto {}
});
