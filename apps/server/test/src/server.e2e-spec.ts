import { INestApplication } from '@nestjs/common';

import { setup, tearDown } from '../setup';

describe('Server test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    [app] = await setup({ useFakeAuthorization: true, user: { id: 1 } });
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it('positive - should be possible to start the server', () => {
    expect(app).toBeDefined();
  });
});
