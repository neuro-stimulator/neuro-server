import { Test, TestingModule } from '@nestjs/testing';
import { CommandIdService } from './command-id.service';
import { max } from 'rxjs/operators';

describe('CommandIdService', () => {
  let service: CommandIdService;

  it('should return first set value', () => {
    const firstValue = 1;
    const maxValue = 10;

    service = new CommandIdService(firstValue, maxValue);

    const value = service.counter;

    expect(value).toEqual(firstValue);
  });

  it('should return incremented value', () => {
    const firstValue = 1;
    const maxValue = 10;

    service = new CommandIdService(firstValue, maxValue);

    expect(service.counter).toEqual(firstValue);
    expect(service.counter).toEqual(firstValue + 1);
  });

  it('should return max value', () => {
    const firstValue = 1;
    const maxValue = 3;

    service = new CommandIdService(firstValue, maxValue);

    expect(service.counter).toEqual(firstValue);
    expect(service.counter).toEqual(firstValue + 1);
    expect(service.counter).toEqual(firstValue + 2);
  });

  it('should reset counter when max value reached', () => {
    const firstValue = 1;
    const maxValue = 3;

    service = new CommandIdService(firstValue, maxValue);

    expect(service.counter).toEqual(firstValue);
    expect(service.counter).toEqual(firstValue + 1);
    expect(service.counter).toEqual(firstValue + 2);
    expect(service.counter).toEqual(firstValue);
  });
});
