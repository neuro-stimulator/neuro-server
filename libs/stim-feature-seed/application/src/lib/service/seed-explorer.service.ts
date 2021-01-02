import { ModulesContainer } from '@nestjs/core';
import { Injectable, Type } from '@nestjs/common';
import { Module } from '@nestjs/core/injector/module';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { SEEDER_METADATA, SeederService } from '@diplomka-backend/stim-feature-seed/domain';

@Injectable()
export class SeedExplorerService {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  public explore(): { instance: SeederService<unknown>; entityClass: Type<any> }[] {
    const modules = [...this.modulesContainer.values()];
    return this.flatMap(modules, (instance: InstanceWrapper) => this.filterProvider(instance, SEEDER_METADATA));
  }

  flatMap(
    modules: Module[],
    callback: (instance: InstanceWrapper) => { instance: SeederService<unknown>; entityClass: Type<any> } | undefined
  ): { instance: SeederService<unknown>; entityClass: Type<any> }[] {
    const items: { instance: SeederService<unknown>; entityClass: Type<any> }[] = modules
      .map((module: Module) => [...module.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), []);
    return items.filter((element) => !!element);
  }

  filterProvider(wrapper: InstanceWrapper, metadataKey: string): { instance: SeederService<unknown>; entityClass: Type<any> } | undefined {
    const { instance } = wrapper;
    if (!instance) {
      return undefined;
    }
    return this.extractMetadata(instance, metadataKey);
  }

  extractMetadata(instance: Record<string, any>, metadataKey: string): { instance: SeederService<unknown>; entityClass: Type<any> } | undefined {
    if (!instance.constructor || !instance.constructor.name.endsWith('Seeder')) {
      return;
    }
    const metadata: Record<string, any> = Reflect.getMetadata(metadataKey, instance.constructor);
    if (!metadata.name.endsWith('Entity')) {
      return;
    }

    return metadata ? { instance: (instance as unknown) as SeederService<unknown>, entityClass: metadata as Type<any> } : undefined;
  }
}
