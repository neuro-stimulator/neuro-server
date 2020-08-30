import { Logger } from '@nestjs/common';
import { ClassType } from 'class-transformer-validator';

import { ExperimentDtoNotFoundException } from './experiment-dto-not-found.exception';

export class DtoFactory {
  private readonly logger: Logger = new Logger(DtoFactory.name);

  private readonly dtoMap: {
    [type: string]: ClassType<any>;
  } = {};

  public getDTO(key: string): ClassType<any> {
    this.logger.debug(`Vyhledávám DTO pro typ: ${key?.toLowerCase()}.`);
    if (!this.dtoMap[key?.toLowerCase()]) {
      throw new ExperimentDtoNotFoundException(key?.toLowerCase());
    }
    return this.dtoMap[key.toLowerCase()];
  }

  public registerDTO<T>(key: string, classType: ClassType<T>) {
    this.logger.debug(`Registruji experiment DTO objekt pro typ: ${key.toLowerCase()}.`);
    this.dtoMap[key.toLowerCase()] = classType;
  }
}
