export type IpcCommandType = 'ipc-close' | 'ipc-open' | 'experiment-asset' | 'server-public-path' | 'stimulator-state-change' | 'toggle-output' | 'toggle-output-synchronization';

export * from './experiment-asset.message';
export * from './server-public-path.message';
export * from './stimulator-state-change.message';
export * from './toggle-output.message';
export * from './toggle-output-synchronization.message';
