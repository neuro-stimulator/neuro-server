import Timeout = NodeJS.Timeout;

import { CommandFromStimulator, Experiment, Output } from '@stechy1/diplomka-share';

export class FakeStimulatorDevice {

  private _stimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY;
  private _timeouts: Timeout[];
  private _experiment: Experiment<Output>;
  private _activeOutputs: boolean[];

  setOutputActive(index: number, active: boolean): void {
    this._activeOutputs[index] = active;
  }

  isOutputActive(index: number): boolean {
    return this._activeOutputs[index];
  }

  set experiment(experiment: Experiment<Output>) {
    this._experiment = experiment;
  }

  get stimulatorState(): number {
    return this._stimulatorState;
  }

  set stimulatorState(stimulatorState: number) {
    this._stimulatorState = stimulatorState;
  }
}
