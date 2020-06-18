import * as path from 'path';

const basePath = process.cwd();

export const environment = {
  production: true,
  testing: false,
  virtualSerialService: false,
  appDataRoot: undefined,
  httpPort: 3006,
  ipcPath: path.join(basePath, 'pipe.sock') /*'/tmp/stimulator/pipe.sock'*/,
  totalOutputCount: 8,
  fileBrowserBasePath: basePath,
  settingsFilename: 'settings.json',
};
