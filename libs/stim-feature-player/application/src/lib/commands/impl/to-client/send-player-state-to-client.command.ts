import { ICommand } from '@nestjs/cqrs';

import { PlayerConfiguration } from '@stechy1/diplomka-share';

export class SendPlayerStateToClientCommand implements ICommand {
  constructor(public readonly playerState: PlayerConfiguration, public readonly clientID?: string) {}
}
