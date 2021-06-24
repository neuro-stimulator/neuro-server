import { DtoFactory } from './dto-factory';
import { ExperimentDtoNotFoundException } from './experiment-dto-not-found.exception';

describe('DtoFactory', () => {
  let factory: DtoFactory;
  let dummyDto: DummyDto;

  beforeEach(async () => {
    factory = new DtoFactory();
    dummyDto = new DummyDto();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('positive - should register DTO', () => {
    const key = 'key';

    factory.registerDTO(key, DummyDto);
    expect(factory.getDTO(key)).toEqual(DummyDto);
  });

  it('negative - should throw exception when key is not found', () => {
    const key = 'key';

   expect(() => factory.getDTO(key)).toThrowError(ExperimentDtoNotFoundException);
  });

  class DummyDto {}
});
