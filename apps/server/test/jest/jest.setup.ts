import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import '../set-environment';
import '../helpers/matchers';

const timeout = 30;

namespace global {

  jest.setTimeout(timeout * 1000);

  // beforeAll(async () => {
  //   console.log('Global before all');
  // })

  beforeEach(async () => {
    console.log('Global before each');
    process.env.DATABASE_PREFIX = uuidv4();
  })

  afterEach(() => {
    console.log('Global after each');
    if (fs.existsSync(process.env.ABSOLUTE_DATABASE_PATH)) {
      try {
        fs.unlinkSync(process.env.ABSOLUTE_DATABASE_PATH);
      } catch (e) {
        console.error(e);
      }
    }
  })

  // afterAll(() => {
  //   console.log('Global after all');
  // })

}
