import { Injectable, Logger } from '@nestjs/common';
import { SerialService } from './serial.service';
import { exec } from 'child_process';
import { FirmwareUpdateFailedException } from '../exception';

@Injectable()
export class StimulatorService {
  private readonly logger: Logger = new Logger(StimulatorService.name);

  constructor(private readonly service: SerialService) {}

  public updateFirmware(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // firmware.path = "/tmp/firmware/some_random_name"
      exec(`sudo cp ${path} /mnt/stm/firmware.bin`, (err, stdout, stderr) => {
        if (err) {
          // some err occurred
          this.logger.error(err);
          throw new FirmwareUpdateFailedException();
        } else {
          // the *entire* stdout and stderr (buffered)
          this.logger.debug(`stdout: ${stdout}`);
          this.logger.error(`stderr: ${stderr}`);
          resolve();
        }
      });
    });
  }
}
