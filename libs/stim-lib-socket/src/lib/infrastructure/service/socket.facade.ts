import { Injectable } from '@nestjs/common';

import { SocketMessage } from '../../domain/model/socket.message';

@Injectable()
export class SocketFacade {
  public sendCommand(clidntID: string, message: SocketMessage) {}

  public broadcastCommand(message: SocketMessage) {}
}
