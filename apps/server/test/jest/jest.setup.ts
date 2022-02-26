import * as fs from 'fs';
import * as path from 'path';

import { v4 as uuidv4 } from 'uuid';

import '../set-environment';
import '../helpers/matchers';

const timeout = 30;

global.markedExperimentResultData = [];

jest.setTimeout(timeout * 1000);

// beforeAll(async () => {
//   console.log('Global before all');
// })

beforeEach(async () => {
  process.env.DATABASE_PREFIX = uuidv4();
})

afterEach(() => {
  if (fs.existsSync(process.env.ABSOLUTE_DATABASE_PATH)) {
    try {
      fs.unlinkSync(process.env.ABSOLUTE_DATABASE_PATH);
    } catch (e) {
      console.error(e);
    }
  }

  if (global.markedExperimentResultData?.length !== 0) {
    const privateDataPath = path.join(process.env['fileBrowser.appDataRoot'], 'private', 'experiment-results');
    for (const fileName of global.markedExperimentResultData) {
      const filePath = path.join(privateDataPath, fileName)
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
})

// afterAll(() => {
//   console.log('Global after all');
// })
