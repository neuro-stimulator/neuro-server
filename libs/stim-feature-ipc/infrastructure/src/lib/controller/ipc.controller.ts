import { Controller, Get, Logger, Patch } from '@nestjs/common';

import { ConnectionStatus, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import {
  AssetPlayerAlreadyRunningException,
  AssetPlayerMainPathNotDefinedException,
  AssetPlayerNotRunningException,
  AssetPlayerPythonPathNotDefinedException,
  IpcAlreadyOpenException,
  NoIpcOpenException,
} from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcFacade } from '../service/ipc.facade';

@Controller('/api/ipc')
export class IpcController {
  private readonly logger: Logger = new Logger(IpcController.name);
  constructor(private readonly facade: IpcFacade) {}

  @Get('status')
  public async status(): Promise<ResponseObject<{ status: ConnectionStatus }>> {
    return { data: { status: await this.facade.status() } };
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
      if (e instanceof IpcAlreadyOpenException) {
        const error = e as IpcAlreadyOpenException;
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

  @Patch('spawn')
  public async spawn(): Promise<ResponseObject<void>> {
    try {
      await this.facade.spawn();
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
      } else if (e instanceof AssetPlayerPythonPathNotDefinedException) {
        const error = e as AssetPlayerPythonPathNotDefinedException;
        this.logger.error('Není definována cesta ke spouštěči pythonu!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else if (e instanceof AssetPlayerMainPathNotDefinedException) {
        const error = e as AssetPlayerMainPathNotDefinedException;
        this.logger.error('Není definována cesta k main.py souboru!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else if (e instanceof AssetPlayerAlreadyRunningException) {
        const error = e as AssetPlayerAlreadyRunningException;
        this.logger.error('Přehrávač multimédií je již spuštěný!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při spouštění přehrávače multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('kill')
  public async kill(): Promise<ResponseObject<void>> {
    try {
      await this.facade.kill();
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS,
        },
      };
    } catch (e) {
      if (e instanceof AssetPlayerNotRunningException) {
        const error = e as AssetPlayerNotRunningException;
        this.logger.error('Uživatel se pokouší vypnout již vypnutý přehrávač multimédií!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při ukončování přehrávače multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
