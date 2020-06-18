// import { Module } from '@nestjs/common';
//
// import { IpcService } from "./ipc.service";
// import { ExperimentsModule } from "../experiments/experiments.module";
// import { FileBrowserModule } from "../file-browser/file-browser.module";
// import { LowLevelModule } from "../low-level/low-level.module";
// import { IpcController } from "libs/stim-feature-ipc/src/lib/infrastructure/controller/ipc.controller";
// import { IpcGateway } from "./ipc.gateway";
//
// @Module({
//   controllers: [
//     IpcController
//   ],
//   providers: [
//     IpcService,
//     IpcGateway,
//   ],
//   imports: [
//     ExperimentsModule,
//     LowLevelModule,
//     FileBrowserModule
//   ],
//   exports: [
//     IpcService
//   ]
// })
export class IpcModule {}
