import { INestApplication } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { InitializeTriggersCommand } from '@diplomka-backend/stim-feature-triggers/application';

import { setup, tearDown } from '../../setup';

describe('Core', () => {
  let app: INestApplication;

  beforeEach(async () => {
    [app] = await setup({ useFakeAuthorization: true, user: { id: 1 } });
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it('positive - should initialize triggers', async () => {
    const commandBus = app.get(CommandBus);
    await commandBus.execute(new InitializeTriggersCommand());
  });
});
