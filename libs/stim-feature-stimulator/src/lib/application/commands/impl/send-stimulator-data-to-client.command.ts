import { ICommand } from '@nestjs/cqrs';
import { StimulatorData } from '../../../domain/model/stimulator-command-data';

export class SendStimulatorDataToClientCommand implements ICommand {
  constructor(public readonly data: StimulatorData) {}
}
