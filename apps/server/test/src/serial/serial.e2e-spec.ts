import { HttpStatus, INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';

import { ConnectionStatus, MessageCodes, ResponseMessage, ResponseObject } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { setup, setupFromConfigFile, tearDown } from '../../setup';
import { closeSerialPort, getSerialConnectionStatus, openSerialPort } from '../../helpers';
import { ENDPOINTS, SERIAL } from '../../helpers/endpoints';

describe('Serial', () => {
  const BASE_API = ENDPOINTS[SERIAL];

  let app: INestApplication;
  let agent: SuperAgentTest;
  let dataContainers: DataContainers;

  afterEach(async () => {
    await tearDown(app);
  });

  describe('discover()', () => {

    beforeEach(async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
    });

    it('positive - should return all available serial ports', async () => {
      const response = await agent.get(`${BASE_API}/discover`).send().expect(200);
      const responseBody: ResponseObject<Record<string, unknown>[]> = response.body;
      const discoveredSerialPorts: Record<string, unknown>[] = responseBody.data;

      expect(discoveredSerialPorts).toBeDefined();
      expect(discoveredSerialPorts).toEqual(
        [
          {
            "path": "virtual"
          }
        ])
    });
  });

  describe('status()', () => {

    beforeEach(async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
    });

    it('positive - should return connection status of serial port', async () => {
      const response = await agent.get(`${BASE_API}/status`).send().expect(HttpStatus.OK);
      const responseBody: ResponseObject<{ status: ConnectionStatus }> = response.body;
      const status = responseBody.data.status;

      expect(status).toEqual(ConnectionStatus.DISCONNECTED);
    });
  });

  describe('open()', () => {
    it('negative - should not open serial port when user is not authorized', async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setup({ useFakeAuthorization: false });

      const response = await agent.post(`${BASE_API}/open`).send({ path: 'virtual' }).expect(HttpStatus.UNAUTHORIZED);
      const body: ResponseObject<void> = response.body;
      const errorMessage: ResponseMessage = body.message;

      expect(errorMessage.code).toEqual(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED);
    });

    it('negative - should not open already opened port', async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');

      await expect(getSerialConnectionStatus(agent)).resolves.toEqual(ConnectionStatus.DISCONNECTED);

      await openSerialPort(agent);
      await expect(getSerialConnectionStatus(agent)).resolves.toEqual(ConnectionStatus.CONNECTED);

      const response = await agent.post(`${BASE_API}/open`).send({ path: 'virtual' }).expect(HttpStatus.BAD_REQUEST);
      const body: ResponseObject<void> = response.body;
      const errorMessage: ResponseMessage = body.message;

      expect(errorMessage.code).toEqual(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_ALREADY_OPEN);
    });

    it('negative - should not open non-existent serial port', async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');

      await expect(getSerialConnectionStatus(agent)).resolves.toEqual(ConnectionStatus.DISCONNECTED);

      const response = await agent.post(`${BASE_API}/open`).send({ path: 'non-existing-port' }).expect(HttpStatus.BAD_REQUEST);
      const body: ResponseObject<void> = response.body;
      const errorMessage: ResponseMessage = body.message;

      expect(errorMessage.code).toEqual(MessageCodes.CODE_ERROR);
    });
  });

  describe('close()', () => {
    it('negative - should not close already closed serial port', async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');

      await expect(getSerialConnectionStatus(agent)).resolves.toEqual(ConnectionStatus.DISCONNECTED);

      const response = await agent.patch(`${BASE_API}/stop`).send().expect(HttpStatus.BAD_REQUEST);
      const body: ResponseObject<void> = response.body;
      const errorMessage: ResponseMessage = body.message;

      expect(errorMessage.code).toEqual(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN);
    });
  });

  describe('open_close cycle()', () => {
    it('positive - should open and close serial port', async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');

      await expect(getSerialConnectionStatus(agent)).resolves.toEqual(ConnectionStatus.DISCONNECTED);

      await openSerialPort(agent);
      await expect(getSerialConnectionStatus(agent)).resolves.toEqual(ConnectionStatus.CONNECTED);

      await closeSerialPort(agent)
      await expect(getSerialConnectionStatus(agent)).resolves.toEqual(ConnectionStatus.DISCONNECTED);
    });
  });
});
