import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DATABASE_CONFIG: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: '../dist/database.sqlite',
  entities: ['../dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
