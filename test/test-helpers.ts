import { getConnection } from 'typeorm';

export function commonAttributes<T>(edited: T, template: T) {
  const uniqueKeys: string[] = Object.keys(edited).filter(key => template[key] === undefined);
  const copy = { ...edited };
  for (const uniqueKey of uniqueKeys) {
    delete copy[uniqueKey];
  }

  return copy;
}

export async function clearDatabase() {
  const connection = getConnection();
  const entities: { name: string, tableName: string }[] = [];
  for (const x of (connection.entityMetadatas)) {
    entities.push({ name: x.name, tableName: x.tableName});
  }

  try {
    for (const entity of entities) {
      const repository = await connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName};`);
      // Reset IDs
      await repository.query(`DELETE FROM sqlite_sequence WHERE name='${entity.tableName}'`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}
