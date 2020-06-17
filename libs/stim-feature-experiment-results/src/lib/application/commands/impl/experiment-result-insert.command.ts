import { ICommand } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

export class ExperimentResultInsertCommand implements ICommand {}
