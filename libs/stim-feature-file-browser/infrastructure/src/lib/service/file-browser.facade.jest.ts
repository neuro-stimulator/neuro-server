import { MockType } from 'test-helpers/test-helpers';

import { FileBrowserFacade } from './file-browser.facade';

export const createFileBrowserFacadeMock: () => MockType<FileBrowserFacade> = jest.fn(() => ({
  getContent: jest.fn(),
  readPrivateJSONFile: jest.fn(),
  createNewFolder: jest.fn(),
  uploadFiles: jest.fn(),
  deleteFile: jest.fn(),
  mergePublicPath: jest.fn(),
  mergePrivatePath: jest.fn(),
  writePrivateJSONFile: jest.fn(),
}));
