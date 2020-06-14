import { MockType } from '../test-helpers';
import { FileBrowserService } from 'libs/stim-feature-file-browser/src/lib/infrastructure/file-browser.service';

export const createFileBrowserServiceMock: () => MockType<
  FileBrowserService
> = jest.fn(() => ({
  mergePath: jest.fn(),
  mergePublicPath: jest.fn(),
  mergePrivatePath: jest.fn(),
  recursiveDelete: jest.fn(),
  moveFiles: jest.fn(),
  getFilesFromDirectory: jest.fn(),
  createDirectory: jest.fn(),
  hashFile: jest.fn(),
  readFileStream: jest.fn(),
  readFileBuffer: jest.fn(),
  writeFileContent: jest.fn(),
  deleteFile: jest.fn(),
  rename: jest.fn(),
  existsFile: jest.fn(),
  isDirectory: jest.fn(),
  getParentDirectory: jest.fn(),
  saveFiles: jest.fn(),
}));
