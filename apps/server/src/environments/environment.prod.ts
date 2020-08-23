const basePath = process.cwd();

export const environment = {
  production: true,
  testing: false,
  virtualSerialService: false,
  appDataRoot: undefined,
  httpPort: 3006,
  totalOutputCount: 8,
  fileBrowserBasePath: basePath,
  settingsFilename: 'settings.json',
};
