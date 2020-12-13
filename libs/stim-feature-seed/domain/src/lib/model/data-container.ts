export interface DataContainer {
  entityName: string;
  entities: Record<string, unknown>[];
  order?: number;
}
