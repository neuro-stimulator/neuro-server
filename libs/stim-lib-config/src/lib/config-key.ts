export type PrimitiveType = string | number | boolean;
export type PrimitiveBoxedType = StringConstructor | NumberConstructor | BooleanConstructor;
export type ConfigKeyUseType = 'optional' | 'required';

export interface ConfigKey<T extends PrimitiveType> {
  name: string;
  type: PrimitiveBoxedType;
  defaultValue?: T;
  use: ConfigKeyUseType;
  restriction?: [T]
}

export interface ConfigKeyOptions<T extends PrimitiveType> {
  defaultValue?: T,
  use?: ConfigKeyUseType,
  restriction?: [T]
}

export function createKey<T extends PrimitiveType>(name: string, type: PrimitiveBoxedType, options?: ConfigKeyOptions<T>) {
  return Object.freeze({
    name,
    type,
    defaultValue: options?.defaultValue || undefined,
    use: options?.use || 'optional',
    restriction: options?.restriction
  });
}
