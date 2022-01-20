export type PrimitiveType = string | number | boolean;
export type PrimitiveBoxedType = StringConstructor | NumberConstructor | BooleanConstructor;
export type ConfigKeyUseType = 'optional' | 'required';

export const DYNAMIC_PART = '%DYNAMIC_PART%';
export const DYNAMIC_FILE_NAME = '%DYNAMIC_FILE_NAME%';

export type DynamicConfigKeyProvider<T extends PrimitiveType> = (dynamicPart: string) => ConfigKey<T>;

export interface ConfigKey<T extends PrimitiveType> extends ConfigKeyOptions<T> {
  name: string;
  type: PrimitiveBoxedType;
}

export interface ConfigKeyOptions<T extends PrimitiveType> {
  defaultValue: T,
  use: ConfigKeyUseType,
  restriction: [T],
  isArray: boolean,
  separator: string
}

export function createKey<T extends PrimitiveType>(name: string, type: PrimitiveBoxedType, options?: Partial<ConfigKey<T>>): ConfigKey<T> {
  return Object.freeze({
    name,
    type,
    defaultValue: options?.defaultValue || undefined,
    use: options?.use || 'optional',
    restriction: options?.restriction,
    isArray: options?.isArray || false,
    separator: options?.separator || ','
  } as ConfigKey<T>);
}

export function createDynamicKeyProvider<T extends PrimitiveType>(name: string, type: PrimitiveBoxedType, options?: Partial<ConfigKey<T>>): DynamicConfigKeyProvider<T> {
  return (dynamicPart: string) => {
    const dynamicName = name.replace(DYNAMIC_PART, dynamicPart);
    return createKey(dynamicName, type, options);
  }
}
