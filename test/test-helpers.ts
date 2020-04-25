import { getConnection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentEntity } from '../src/experiments/entity/experiment.entity';
import { ExperimentErpEntity } from '../src/experiments/entity/experiment-erp.entity';
import { ExperimentErpOutputEntity } from '../src/experiments/entity/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from '../src/experiments/entity/experiment-erp-output-dependency.entity';
import { ExperimentCvepEntity } from '../src/experiments/entity/experiment-cvep.entity';
import { ExperimentFvepEntity } from '../src/experiments/entity/experiment-fvep.entity';
import { ExperimentFvepOutputEntity } from '../src/experiments/entity/experiment-fvep-output.entity';
import { ExperimentTvepEntity } from '../src/experiments/entity/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from '../src/experiments/entity/experiment-tvep-output.entity';
import { ExperimentReaEntity } from '../src/experiments/entity/experiment-rea.entity';
import { ExperimentResultEntity } from '../src/experiment-results/entity/experiment-result.entity';
import { SequenceEntity } from '../src/sequences/entity/sequence.entity';

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
  const orderedEntities: string[] = [
    SequenceEntity.name,
    ExperimentResultEntity.name,
    ExperimentCvepEntity.name,
    ExperimentErpOutputDependencyEntity.name,
    ExperimentErpOutputEntity.name,
    ExperimentErpEntity.name,
    ExperimentFvepOutputEntity.name,
    ExperimentFvepEntity.name,
    ExperimentTvepOutputEntity.name,
    ExperimentTvepEntity.name,
    ExperimentReaEntity.name,
    ExperimentEntity.name,
  ];

  const entities: { name: string, tableName: string }[] = new Array(orderedEntities.length);
  for (const x of (connection.entityMetadatas)) {
    entities[orderedEntities.indexOf(x.name)] = { name: x.name, tableName: x.tableName};
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

export function createInMemoryTypeOrmModule() {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    keepConnectionAlive: true
  });
}
