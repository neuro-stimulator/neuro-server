import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseModuleOptions {}

export interface BaseModuleOptionsFactory<O extends BaseModuleOptions> {
  createOptions(): Promise<O> | O;
}

export interface BaseAsyncOptions<O> extends Pick<ModuleMetadata, 'imports'>, Pick<FactoryProvider<O>, 'inject'> {
  name: string;
  useExisting?: Type<BaseModuleOptionsFactory<O>>;
  useClass?: Type<BaseModuleOptionsFactory<O>>;
  useFactory?: (...args: unknown[]) => Promise<BaseModuleOptionsFactory<O>> | BaseModuleOptionsFactory<O>;
}
