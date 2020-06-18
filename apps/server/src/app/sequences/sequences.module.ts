// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
//
// import { ExperimentsModule } from "../experiments/experiments.module";
// import { SequencesService } from "libs/stim-feature-sequences/src/lib/domain/services/sequences.service";
// import { SequencesController } from "libs/stim-feature-sequences/src/lib/infrastructure/controller/sequences-controller";
// import { SequencesGateway } from "./sequences-gateway";
// import { SequenceEntity } from "libs/stim-feature-sequences/src/lib/domain/model/entity/sequence.entity";
// import { SequenceRepository } from "libs/stim-feature-sequences/src/lib/domain/repository/sequence.repository";
//
// @Module({
//   controllers: [
//     SequencesController
//   ],
//   providers: [
//     SequencesService,
//     SequencesGateway,
//
//     SequenceRepository
//   ],
//   imports: [
//     TypeOrmModule.forFeature([
//       SequenceEntity
//     ]),
//     ExperimentsModule
//   ],
//   exports: [
//     SequencesService
//   ],
// })
export class SequencesModule {}
