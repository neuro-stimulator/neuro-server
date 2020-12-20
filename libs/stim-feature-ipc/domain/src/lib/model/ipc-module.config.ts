export interface IpcModuleConfig {
  pathToPython: string;
  pathToMain: string;
  communicationPort?: number;
  frameRate?: number;
  openPortAutomatically?: boolean;
}
