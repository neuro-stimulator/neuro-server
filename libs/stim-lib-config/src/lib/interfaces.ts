import { ModuleMetadata, Type } from '@nestjs/common';

export interface BaseModuleOptions {
}

export interface BaseModuleOptionsFactory<O extends BaseModuleOptions> {
  createOptions(): Promise<O> | O;
}

export interface BaseAsyncOptions<O> extends Pick<ModuleMetadata, 'imports'> {
  name: string;
  useExisting?: Type<BaseModuleOptionsFactory<O>>;
  useClass?: Type<BaseModuleOptionsFactory<O>>;
  useFactory?: (...args: any[]) => Promise<BaseModuleOptionsFactory<O>> | BaseModuleOptionsFactory<O>;
  inject?: any[];
}
