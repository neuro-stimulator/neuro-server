import { INestApplication } from '@nestjs/common';

import './set-environment'; // always call first to setup ENVIRONMENT_VARIABLES
import { setup, tearDown } from '../setup';

describe('Server test', () => {
  const DATA_CONTAINERS_ROOT = '';

  let app: INestApplication;

  beforeEach(async () => {
    [app] = await setup({ useFakeAuthorization: true, user: { id: 1 }, dataContainersRoot: DATA_CONTAINERS_ROOT });
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it('positive - should be possible to start the server', () => {
    expect(app).toBeDefined();
  });
});
