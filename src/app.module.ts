import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONFIG } from './database.config';
import { Connection } from 'typeorm';
import { ExperimentsModule } from './experiments/experiments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),

    ExperimentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
