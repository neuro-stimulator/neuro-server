import { ICommand } from '@nestjs/cqrs';

export class SendAssetConfigurationToIpcCommand implements ICommand {
  constructor(public readonly userGroups: number[], public readonly experimentID?: number) {}
}
