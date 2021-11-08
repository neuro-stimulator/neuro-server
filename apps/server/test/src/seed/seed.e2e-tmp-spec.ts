import { INestApplication } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { DatabaseDumpCommand } from '@neuro-server/stim-feature-seed/application';

import { setup, tearDown } from '../../setup';

// Do not run this test in CI
// It is used just for easier generating dump of database
describe('Seed', () => {
  const DATA_CONTAINERS_ROOT = '';

  let app: INestApplication;

  beforeEach(async () => {
    [app] = await setup({ useFakeAuthorization: true, user: { id: 1 } });
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it('should dump database to console', async () => {
    const commandBus = app.get(CommandBus);
    await commandBus.execute(new DatabaseDumpCommand('/tmp/dump'));
  });
});
