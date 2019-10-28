import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ExperimentsModule } from './experiments/experiments.module';
import { CorsMiddleware } from './cors.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(),

    ExperimentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  constructor(private readonly connection: Connection) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(CorsMiddleware)
    .forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
