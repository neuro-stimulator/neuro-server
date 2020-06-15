// import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
//
// import { FileBrowserController } from './file-browser.controller';
// import { FileBrowserService } from 'libs/stim-feature-file-browser/src/lib/infrastructure/file-browser.service';
//
// @Module({
//   controllers: [FileBrowserController],
//   imports: [
//     MulterModule.registerAsync({
//       imports: [FileBrowserModule],
//       inject: [FileBrowserService],
//       useFactory: (fileBrowser: FileBrowserService): MulterOptions => {
//         return {
//           dest: fileBrowser.mergePrivatePath('uploads'),
//         };
//       },
//     }),
//   ],
//   providers: [FileBrowserService],
//   exports: [FileBrowserService],
// })
export class FileBrowserModule {}
