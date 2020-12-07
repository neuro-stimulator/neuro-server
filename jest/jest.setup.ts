import { Logger } from '@nestjs/common/services';

import { createNoOpLogger } from '../test-helpers/test-helpers';

export const setup = async () => {
  console.log('Global setup!');

  Logger.overrideLogger(createNoOpLogger());
};
