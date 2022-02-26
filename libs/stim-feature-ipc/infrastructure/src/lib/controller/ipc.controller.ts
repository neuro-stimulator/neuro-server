import { Controller, Get, Logger, Patch, UseGuards } from '@nestjs/common';

import { ConnectionStatus, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';
import {
  AssetPlayerAlreadyRunningException,
  AssetPlayerMainPathNotDefinedException,
  AssetPlayerNotRunningException,
  AssetPlayerPythonPathNotDefinedException,
  IpcAlreadyOpenException,
  NoIpcOpenException,
} from '@neuro-server/stim-feature-ipc/domain';
import { ControllerException } from '@neuro-server/stim-lib-common';

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
  @UseGuards(IsAuthorizedGuard)
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
        this.logger.error('Jiné spojení s přehrávačem multimédií je již vytvořené!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při otevírání spojení s přehrávačem multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('close')
  @UseGuards(IsAuthorizedGuard)
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
        this.logger.error('Není vytvořeno žádné spojení s přehrávačem multimédií!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při zavírání spojení s přehrávačem multimédií');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('spawn')
  @UseGuards(IsAuthorizedGuard)
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
        this.logger.error('Není vytvořeno žádné spojení s přehrávačem multimédií!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else if (e instanceof AssetPlayerPythonPathNotDefinedException) {
        this.logger.error('Není definována cesta ke spouštěči pythonu!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else if (e instanceof AssetPlayerMainPathNotDefinedException) {
        this.logger.error('Není definována cesta k main.py souboru!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else if (e instanceof AssetPlayerAlreadyRunningException) {
        this.logger.error('Přehrávač multimédií je již spuštěný!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při spouštění přehrávače multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('kill')
  @UseGuards(IsAuthorizedGuard)
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
        this.logger.error('Uživatel se pokouší vypnout již vypnutý přehrávač multimédií!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při ukončování přehrávače multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
