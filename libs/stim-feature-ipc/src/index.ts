export * from './lib/stim-feature-ipc.module';

export { IpcFacade } from './lib/infrastructure/service/ipc.facade';

export * from './lib/application/commands/impl/ipc-close.command';
export * from './lib/application/commands/impl/ipc-open.command';
export * from './lib/application/commands/impl/ipc-send-message.command';

export * from './lib/application/event/impl/ipc-closed.event';
export * from './lib/application/event/impl/ipc-connected.event';
export * from './lib/application/event/impl/ipc-disconnected.event';
export * from './lib/application/event/impl/ipc-error.event';
export * from './lib/application/event/impl/ipc-listening.event';
export * from './lib/application/event/impl/ipc-message.event';
export * from './lib/application/event/impl/ipc-was-open.event';

export * from './lib/application/queries/impl/is-ipc-connected.query';

export * from './lib/domain/model/ipc-message';
