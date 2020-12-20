import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { ResponseObject, User } from '@stechy1/diplomka-share';

import { DataContainer } from '@diplomka-backend/stim-feature-seed/domain';
import { UserEntity } from '@diplomka-backend/stim-feature-users/domain';

import '../set-environment'; // always call first to setup ENVIRONMENT_VARIABLES
import { setup, tearDown } from '../../setup';
import { CookieFlags, extractCookies, ExtractedCookies, performLoginFromDataContainer, performLogout } from '../../helpers';

describe('Authorization', () => {
  const BASE_API = '/api/auth';
  const DATA_CONTAINERS_ROOT = 'auth';

  let app: INestApplication;
  let agent: SuperAgentTest;

  afterEach(async () => {
    await tearDown(app);
  });

  describe('login', () => {
    let xsrfToken: string;

    afterEach(async () => {
      await performLogout(agent, xsrfToken);
    });

    it('positive - should be possible to do login', async () => {
      // url adresa pro přihlášení
      const loginUrl = `${BASE_API}/login`;
      // data kontejnery
      let dataContainers: Record<string, DataContainer[]>;

      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthentication: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

      // uživatel načtený z data kontejnerů
      const userEntity: User = dataContainers[UserEntity.name][0].entities[0];
      // tělo požadavku pro přihlášení
      const userRequestBody: User = {
        email: userEntity.email,
        password: process.env.DEFAULT_USER_PASSWORD,
      };

      // odešle samotný požadavek
      const loginResponse = await agent.post(loginUrl).send(userRequestBody).set('Cookie', '');
      // vytáhnu cookies z odpovědi
      const loginCookies: ExtractedCookies = extractCookies(loginResponse.headers);

      // kontrola, že status code je 200
      expect(loginResponse.status).toBe(200);
      // kontrola SESSIONID cookie
      expect(loginCookies['SESSIONID']).toBeDefined();
      expect(loginCookies['SESSIONID'].value.length).toBeGreaterThan(0);
      expect(loginCookies['SESSIONID'].flags).toEqual(
        expect.objectContaining({
          Path: '/',
          HttpOnly: true,
          SameSite: 'Strict',
        } as CookieFlags)
      );

      // kontrola XSRF-TOKEN cookie
      expect(loginCookies['XSRF-TOKEN']).toBeDefined();
      expect(loginCookies['XSRF-TOKEN'].value.length).toBeGreaterThan(0);
      expect(loginCookies['XSRF-TOKEN'].flags).toEqual(
        expect.objectContaining({
          Path: '/',
          SameSite: 'Strict',
        } as CookieFlags)
      );
      xsrfToken = loginCookies['XSRF-TOKEN'].value;

      // kontrola těla odpovědi
      expect((loginResponse.body as ResponseObject<User>).data).toEqual(
        expect.objectContaining({
          email: userEntity.email,
          username: userEntity.username,
          createdAt: userEntity.createdAt,
          updatedAt: userEntity.updatedAt,
        } as User)
      );
    });
  });

  describe('logout', () => {
    // url adresa pro odhlášení
    const logoutUrl = `${BASE_API}/logout`;
    // data kontejnery
    let dataContainers: Record<string, DataContainer[]>;
    let xsrfToken: string;

    beforeEach(async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthentication: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

      xsrfToken = await performLoginFromDataContainer(agent, dataContainers, { autoInjectXsrfToken: false });
    });

    it('positive - should be possible to do logout', async () => {
      // odešlu požadavek na odhlášení uživatele
      const logoutResponse = await agent.post(logoutUrl).set({ 'x-xsrf-token': xsrfToken }).send();
      // vytáhnu cookies z odpovědi
      const logoutCookies: ExtractedCookies = extractCookies(logoutResponse.headers);

      // kontrola, že status code je 200
      expect(logoutResponse.status).toBe(200);
      // kontrola SESSIONID cookie
      expect(logoutCookies['SESSIONID']).toBeDefined();
      expect(logoutCookies['SESSIONID'].value).toHaveLength(0);
      // kontrola XSRF-TOKEN cookie
      expect(logoutCookies['XSRF-TOKEN']).toBeDefined();
      expect(logoutCookies['XSRF-TOKEN'].value).toHaveLength(0);
    });
  });

  describe('refresh JWT', () => {
    beforeEach(async () => {
      // data kontejnery
      let dataContainers: Record<string, DataContainer[]>;

      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthentication: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

      await performLoginFromDataContainer(agent, dataContainers);
    });

    afterEach(async () => {
      await performLogout(agent);
    });

    it('positive - should be possible to refresh JWT', async () => {
      // url adresa pro obnovení JWT
      const url = `${BASE_API}/refresh-jwt`;

      const response = await agent.patch(url).send();
      const cookies = extractCookies(response.headers);
      const newXsrfToken = cookies['XSRF-TOKEN'].value;

      agent.use((req) => req.set({ 'x-xsrf-token': newXsrfToken }));
    });
  });
});
