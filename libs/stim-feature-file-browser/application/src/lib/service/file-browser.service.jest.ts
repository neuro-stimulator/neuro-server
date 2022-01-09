import { MockType } from 'test-helpers/test-helpers';

import { FileBrowserService } from './file-browser.service';

export const createFileBrowserServiceMock: () => MockType<FileBrowserService> = jest.fn(() => ({
  isDirectory: jest.fn(),
  hashFile: jest.fn(),
  moveFiles: jest.fn(),
  getParentDirectory: jest.fn(),
  recursiveDelete: jest.fn(),
  rename: jest.fn(),
  mergePrivatePath: jest.fn(),
  readFileStream: jest.fn(),
  readFileBuffer: jest.fn(),
  deleteFile: jest.fn(),
  writeFileContent: jest.fn(),
  mergePath: jest.fn(),
  createDirectory: jest.fn(),
  mergePublicPath: jest.fn(),
  existsFile: jest.fn(),
  getFilesFromDirectory: jest.fn(),
  isPrivatePathSecured: jest.fn(),
  privatePath: jest.fn(),
  publicPath: jest.fn(),
}));
