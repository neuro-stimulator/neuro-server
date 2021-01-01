import { Response, SuperAgentTest } from 'supertest';

import { User } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';
import { UserEntity } from '@diplomka-backend/stim-feature-users/domain';

import { extractCookies, ExtractedCookies } from './cookie-extractor';

export interface LoginOptions {
  /**
   * True, pokud se mají na začátek requestu vložit prázdné cookies
   */
  useEmptyCookie?: boolean;
  /**
   * True, pokud se má po přihlášení automaticky vkládat hlavička s XSRF tokenem
   */
  autoInjectXsrfToken?: boolean;
}

const DEFAULT_LOGIN_OPTIONS: LoginOptions = {
  useEmptyCookie: true,
  autoInjectXsrfToken: true,
};

/**
 * Odešle požadavek na přihlášení uživatele, kterého si automaticky vytáhne z datakontejnerů jako PRVNÍHO
 *
 * @param agent Agent
 * @param dataContainers Datakontejnery
 * @param userID ID uživatele, který se vybere z datakontejneru
 * @param options LoginOptions Pokud nejsou vyplněny, použijí se defaultní hodnoty
 *                Defaultní hodnoty:
 *                 - useEmptyCookie: true
 *                 - autoInjectXsrfToken: true
 */
export async function performLoginFromDataContainer(agent: SuperAgentTest, dataContainers: DataContainers, userID = 1, options: LoginOptions = {}): Promise<string> {
  // uživatel načtený z data kontejnerů
  const userEntity: User = dataContainers[UserEntity.name][0].entities[userID - 1];
  // tělo požadavku pro přihlášení
  const user: User = {
    email: userEntity.email,
    password: process.env.DEFAULT_USER_PASSWORD,
  };

  // ryhle se přihlásím
  return await performLogin(agent, user, options);
}

/**
 * Odešle požadavek na přihlášení uživatele
 *
 * @param agent Agent,
 * @param user Uživatel, který se má přihlásit
 * @param options Nastavení přihlašovacího požadavku
 * @return string XSRF token, který se musí odesílat v hlavičce k úspěšné autentizaci po authorizaci
 */
export async function performLogin(agent: SuperAgentTest, user: User, options: LoginOptions = {}): Promise<string> {
  options = Object.assign({}, DEFAULT_LOGIN_OPTIONS, options);

  // url endpointu
  const url = '/api/auth/login';

  // vytvořím POST požadavek
  const request = agent.post(url);
  // pokud je potřeba, nastavím cookies na prázdnou hodnotu
  if (options.useEmptyCookie) {
    request.set('Cookie', '');
  }
  // odešlu login požadavek
  const response: Response = await request.send(user);
  // vytáhnu cookies z odpovědi
  const cookies: ExtractedCookies = extractCookies(response.headers);
  // pokud mám injectnout xsrf hlavičku do všech budoucích požadavků
  if (options.autoInjectXsrfToken) {
    agent.use((req) => req.set({ 'x-xsrf-token': cookies['XSRF-TOKEN']?.value || undefined }));
  }

  // vrátím XSRF token, který bude potřeba k identifikaci uživatele
  return cookies['XSRF-TOKEN']?.value || null;
}

/**
 * Odešle požadavek na odhášení uživatele
 *
 * @param agent Agent
 * @param xsrfToken XSRF token, nutný k identifikaci uživatele
 */
export async function performLogout(agent: SuperAgentTest, xsrfToken?: string): Promise<void> {
  // url endpointu
  const url = '/api/auth/logout';

  // založím POST požadavek
  let request = agent.post(url);
  // pokud je definován XSRF token
  if (xsrfToken) {
    // nastavím hlavičku
    request = request.set('x-xsrf-token', xsrfToken);
  }

  // odešlu požadavek
  await request.send().expect(200);
}
