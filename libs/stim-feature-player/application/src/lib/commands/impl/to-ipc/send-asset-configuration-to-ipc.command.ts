import { ICommand } from '@nestjs/cqrs';

export class SendAssetConfigurationToIpcCommand implements ICommand {
  constructor(public readonly userID: number, public readonly experimentID?: number) {}
}
