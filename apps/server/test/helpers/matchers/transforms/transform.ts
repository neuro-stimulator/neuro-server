export type Transform<T, O> = (type: T) => O

export type TransformMap<T> = { [key in keyof Partial<T>]: Transform<T, unknown> }
