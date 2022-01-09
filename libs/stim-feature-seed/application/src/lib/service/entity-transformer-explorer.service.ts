import { Injectable, Type } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';

import { ENTITY_TRANSFORMER_METADATA, EntityTransformerService } from '@neuro-server/stim-feature-seed/domain';

@Injectable()
export class EntityTransformerExplorerService {

  constructor(private readonly modulesContainer: ModulesContainer) {}

  public explore(): { instance: EntityTransformerService<unknown>; entityClass: Type<any> }[] {
    const modules = [...this.modulesContainer.values()];
    return this.flatMap(modules, (instance: InstanceWrapper) => this.filterProvider(instance, ENTITY_TRANSFORMER_METADATA));
  }

  flatMap(
    modules: Module[],
    callback: (instance: InstanceWrapper) => { instance: EntityTransformerService<unknown>; entityClass: Type<any> } | undefined
  ): { instance: EntityTransformerService<unknown>; entityClass: Type<any> }[] {
    const items: { instance: EntityTransformerService<unknown>; entityClass: Type<any> }[] = modules
    .map((module: Module) => [...module.providers.values()].map(callback))
    .reduce((a, b) => a.concat(b), []);
    return items.filter((element) => !!element);
  }

  filterProvider(wrapper: InstanceWrapper, metadataKey: string): { instance: EntityTransformerService<unknown>; entityClass: Type<any> } | undefined {
    const { instance } = wrapper;
    if (!instance) {
      return undefined;
    }
    return this.extractMetadata(instance, metadataKey);
  }

  extractMetadata(instance: Record<string, any>, metadataKey: string): { instance: EntityTransformerService<unknown>; entityClass: Type<any> } | undefined {
    if (!instance.constructor || !instance.constructor.name.endsWith('Transform')) {
      return;
    }
    const metadata: Record<string, any> = Reflect.getMetadata(metadataKey, instance.constructor);
    if (!metadata || !metadata.name.endsWith('Entity')) {
      return;
    }

    return metadata ? { instance: (instance as unknown) as EntityTransformerService<unknown>, entityClass: metadata as Type<any> } : undefined;
  }

}
