import { Logger } from '@nestjs/common';

import { ClassType } from '@stechy1/class-transformer-validator';

import { DtoNotFoundException } from '../exceptions/dto-not-found.exception';

import { DTO } from '../model/dto';

export class DtoService<T extends number> {

  private readonly logger: Logger = new Logger(DtoService.name);

  private readonly DTO_MAP: {
    [type in T]?: {
      name: string,
      dto: ClassType<DTO<T>>
    }
  } = {};

  public registerDTO<D extends DTO<T>>(key: T, dto: ClassType<D>, name: string): void {
    this.logger.verbose(`Registruji DTO objekt s klíčem: ${key} pro typ: ${name}.`);
    this.DTO_MAP[key] = {
      name,
      dto
    };
  }

  public getDTO(key: T): ClassType<DTO<T>> {
    this.logger.verbose(`Vyhledávám DTO s klíčem: ${key}.`);
    const dtoObject = this.DTO_MAP[key];

    if (dtoObject === undefined) {
      throw new DtoNotFoundException(key);
    }

    this.logger.verbose(`Byl nalezen DTO objekt pro typ: ${dtoObject.name}.`);
    return dtoObject.dto;
  }
}
