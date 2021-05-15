import { SuperAgentTest } from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { ResponseObject, User } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';
import { UserEntity } from '@diplomka-backend/stim-feature-users/domain';

import { setup, tearDown } from '../../setup';
import { CookieFlags, extractCookies, ExtractedCookies, performLoginFromDataContainer, performLogout } from '../../helpers';
import DoneCallback = jest.DoneCallback;

describe('Authorization', () => {
  const BASE_API = '/api/auth';
  const DATA_CONTAINERS_ROOT = 'auth';

  let supressLogout = false;

  let app: INestApplication;
  let agent: SuperAgentTest;

  describe('login', () => {
    let xsrfToken: string;

    afterEach(async () => {
      if (!supressLogout) {
        await performLogout(agent, xsrfToken);
      }
      await tearDown(app);
    });

    it('positive - should be possible to do login', async () => {
      // url adresa pro přihlášení
      const loginUrl = `${BASE_API}/login`;
      // data kontejnery
      let dataContainers: DataContainers;

      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthorization: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

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
      expect(loginResponse.status).toBe(HttpStatus.OK);
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

    it('negative - should not login non existing user', async () => {
      // potlačím zavolání odhlášení na konci testu - logout nemá smysl, protože se ani nepřihlásím
      supressLogout = true;
      // url adresa pro přihlášení
      const loginUrl = `${BASE_API}/login`;

      // spuštění serveru
      [app, agent] = await setup({ useFakeAuthorization: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

      // tělo požadavku pro přihlášení
      const userRequestBody: User = {
        email: 'invalidUserEmail',
        password: process.env.DEFAULT_USER_PASSWORD,
      };

      // odešle samotný požadavek
      const loginResponse = await agent.post(loginUrl).send(userRequestBody).set('Cookie', '');
      // vytáhnu cookies z odpovědi
      const logoutCookies: ExtractedCookies = extractCookies(loginResponse.headers);

      // kontrola, že status code je 401
      expect(loginResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      // kontrola SESSIONID cookie
      expect(logoutCookies['SESSIONID']).toBeDefined();
      expect(logoutCookies['SESSIONID'].value).toHaveLength(0);
      // kontrola XSRF-TOKEN cookie
      expect(logoutCookies['XSRF-TOKEN']).toBeDefined();
      expect(logoutCookies['XSRF-TOKEN'].value).toHaveLength(0);
    });

    it('negative - should not login user with invalid password', async () => {
      // potlačím zavolání odhlášení na konci testu - logout nemá smysl, protože se ani nepřihlásím
      supressLogout = true;
      // url adresa pro přihlášení
      const loginUrl = `${BASE_API}/login`;
      // data kontejnery
      let dataContainers: DataContainers;

      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthorization: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

      // uživatel načtený z data kontejnerů
      const userEntity: User = dataContainers[UserEntity.name][0].entities[0];
      // tělo požadavku pro přihlášení
      const userRequestBody: User = {
        email: userEntity.email,
        password: 'invalidPassword',
      };

      // odešle samotný požadavek
      const loginResponse = await agent.post(loginUrl).send(userRequestBody).set('Cookie', '');
      // vytáhnu cookies z odpovědi
      const logoutCookies: ExtractedCookies = extractCookies(loginResponse.headers);

      // kontrola, že status code je 401
      expect(loginResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      // kontrola SESSIONID cookie
      expect(logoutCookies['SESSIONID']).toBeDefined();
      expect(logoutCookies['SESSIONID'].value).toHaveLength(0);
      // kontrola XSRF-TOKEN cookie
      expect(logoutCookies['XSRF-TOKEN']).toBeDefined();
      expect(logoutCookies['XSRF-TOKEN'].value).toHaveLength(0);
    });
  });

  describe('logout', () => {
    // url adresa pro odhlášení
    const logoutUrl = `${BASE_API}/logout`;
    const userId = 1;
    // data kontejnery
    let dataContainers: DataContainers;
    let xsrfToken: string;

    beforeEach(async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthorization: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

      xsrfToken = await performLoginFromDataContainer(agent, dataContainers, userId, { autoInjectXsrfToken: false });
    });

    afterEach(async () => {
      await tearDown(app);
    });

    it('positive - should be possible to do logout', async () => {
      // odešlu požadavek na odhlášení uživatele
      const logoutResponse = await agent.post(logoutUrl).set({ 'x-xsrf-token': xsrfToken }).send();
      // vytáhnu cookies z odpovědi
      const logoutCookies: ExtractedCookies = extractCookies(logoutResponse.headers);

      // kontrola, že status code je 200
      expect(logoutResponse.status).toBe(HttpStatus.OK);
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
      let dataContainers: DataContainers;

      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthorization: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

      await performLoginFromDataContainer(agent, dataContainers);
    });

    afterEach(async () => {
      await performLogout(agent);
      await tearDown(app);
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

  it('positive - should do login, logout and login again', async () => {
    // data kontejnery
    const userId = 1;
    let dataContainers: DataContainers;
    let xsrfToken: string;

    // spuštění serveru
    [app, agent, dataContainers] = await setup({ useFakeAuthorization: false, dataContainersRoot: DATA_CONTAINERS_ROOT });

    // první přihlášení a odhlášení
    xsrfToken = await performLoginFromDataContainer(agent, dataContainers, userId, { autoInjectXsrfToken: false });
    await performLogout(agent, xsrfToken);

    // druhé přihlášení a odhlášení
    xsrfToken = await performLoginFromDataContainer(agent, dataContainers, userId, { autoInjectXsrfToken: false });
    await performLogout(agent, xsrfToken);
  });
});
