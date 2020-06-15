import { Controller } from '@nestjs/common';

import { StimulatorFacade } from '../service/stimulator.facade';

@Controller('/api/stimulator')
export class StimulatorController {
  constructor(private readonly stimulator: StimulatorFacade) {}
}
