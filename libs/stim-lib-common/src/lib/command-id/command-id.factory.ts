import { CommandIdService } from './command-id.service';

const instanceMap: Record<string, CommandIdService> = {};

export function createCommandIdFactory(moduleName: string, firstValue = 1, maxValue = 0xf): () => CommandIdService {
  return () => {
    if (!instanceMap[moduleName]) {
      instanceMap[moduleName] = new CommandIdService(moduleName, firstValue, maxValue);
    }

    return instanceMap[moduleName];
  };
}
