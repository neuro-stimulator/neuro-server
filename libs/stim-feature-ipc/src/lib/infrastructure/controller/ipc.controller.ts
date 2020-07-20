import { Controller, Get, Logger, Patch } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { IpcAlreadyConnectedError } from '../../domain/exception/ipc-already-connected.error';
import { NoIpcOpenError } from '../../domain/exception/no-ipc-open.error';
import { IpcFacade } from '../service/ipc.facade';

@Controller('/api/ipc')
export class IpcController {
  private readonly logger: Logger = new Logger(IpcController.name);
  constructor(private readonly facade: IpcFacade) {}

  @Get('status')
  public async status(): Promise<ResponseObject<{ connected: boolean }>> {
    return { data: { connected: await this.facade.isConnected() } };
  }

  @Patch('open')
  public async open(): Promise<ResponseObject<any>> {
    try {
      await this.facade.open();
      return {
        message: {
          code: 0,
        },
      };
    } catch (e) {
      if (e instanceof IpcAlreadyConnectedError) {
        this.logger.error('Nelze znovu otevřít IPC!');
      }
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Patch('close')
  public async close(): Promise<ResponseObject<any>> {
    try {
      await this.facade.close();
      return {
        message: {
          code: 0,
        },
      };
    } catch (e) {
      if (e instanceof NoIpcOpenError) {
        this.logger.error('Nelze zavřít žádnou IPC!');
      }
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }
}
