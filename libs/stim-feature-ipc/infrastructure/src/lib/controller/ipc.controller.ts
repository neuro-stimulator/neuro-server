import { Controller, Get, Logger, Patch } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { IpcAlreadyConnectedException, NoIpcOpenException } from '@diplomka-backend/stim-feature-ipc/domain';

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
  public async open(): Promise<ResponseObject<void>> {
    try {
      await this.facade.open();
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS,
        },
      };
    } catch (e) {
      if (e instanceof IpcAlreadyConnectedException) {
        const error = e as IpcAlreadyConnectedException;
        this.logger.error('Jiné spojení s přehrávačem multimédií je již vytvořené!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při otevírání spojení s přehrávačem multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('close')
  public async close(): Promise<ResponseObject<void>> {
    try {
      await this.facade.close();
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS,
        },
      };
    } catch (e) {
      if (e instanceof NoIpcOpenException) {
        const error = e as NoIpcOpenException;
        this.logger.error('Není vytvořeno žádné spojení s přehrávačem multimédií!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při zavírání spojení s přehrávačem multimédií');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
