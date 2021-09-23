import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { ResponseObject, User } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { ENDPOINTS, USERS } from '../../helpers/endpoints';
import { setupFromConfigFile, tearDown } from '../../setup';

describe('Users', () => {

  const BASE_API = ENDPOINTS[USERS];

  let app: INestApplication;
  let agent: SuperAgentTest;
  let dataContainers: DataContainers;

  afterEach(async () => {
    await tearDown(app);
  });

  describe('Get users by group', () => {

    beforeEach(async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
    });

    it('positive - should return all users in group', async () => {
      const response = await agent.get(`${BASE_API}?groups=1,2`).send().expect(200);
      const responseBody: ResponseObject<User[]> = response.body;
      const users: User[] = responseBody.data;

      expect(users).toBeDefined();
    });

  });
});
