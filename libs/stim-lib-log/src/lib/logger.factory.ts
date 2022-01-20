import { EOL } from 'os';
import * as path from 'path';

import { Logger as NestLogger } from '@nestjs/common';

import { createLogger, LoggerOptions, Logger as WinstonLogger } from 'winston';
import * as TransportStream from 'winston-transport';

import { FileBrowserModuleConfig } from '@neuro-server/stim-feature-file-browser/domain';
import { DYNAMIC_FILE_NAME } from '@neuro-server/stim-lib-config';

import { LogModuleConfig } from './config/log.config-descriptor';
import { customFormatter } from './formatter/custom.formatter';
import { ConsoleTransport } from './transport/console.transport';
import { FileTransport } from './transport/file.transport';
import { Logger } from './logger';


export const loggerFactory: (config: LogModuleConfig, pathConfig: FileBrowserModuleConfig) => Logger = (config: LogModuleConfig, pathConfig: FileBrowserModuleConfig) => {

  const loggerContext = 'LoggerFactory';
  const logger = new NestLogger(loggerContext);

  const transportStreams: TransportStream[] = [];
  const customFormat = customFormatter(config.consoleLog.properties.dateTimeFormat, process.pid);

  if (config.consoleLog.enabled) {
    const consoleConfig = config.consoleLog.properties;

    transportStreams.push(new ConsoleTransport({
      format: customFormat,
      level: consoleConfig.level,
    }))
    logger.log('Logování do konzole je aktivní.');
  }

  if (config.fileLog.enabled) {
    logger.log('Logování do souboru je aktivní.');
    const fileConfig = config.fileLog.properties;

    const commonConfig = {
      maxSize: fileConfig.maxSize > 0 ? fileConfig.maxSize + 'm' : undefined,
      maxFiles: fileConfig.maxFiles > 0 ? fileConfig.maxFiles + 'd' : undefined,
      zippedArchive: fileConfig.zipOldLogs,
      datePattern: fileConfig.datePattern,
      dirname: path.resolve(pathConfig.appDataRoot, config.fileLog.directory),
      json: fileConfig.json,
      format: customFormat,
      eol: EOL,
    };

    transportStreams.push(new FileTransport({
      ...commonConfig,
      filename: fileConfig.filenamePattern.replace(DYNAMIC_FILE_NAME, fileConfig.filename),
      level: fileConfig.level,
    }));

    for (const customLog in config.custom) {
      const customLogConfig = config.custom[customLog];
      if (!customLogConfig.enabled) {
        logger.log(`Logování speciálních logů '${customLog}' není aktivní.`)
        continue;
      }

      transportStreams.push(new FileTransport({
        ...commonConfig,
        filename: fileConfig.filenamePattern.replace(DYNAMIC_FILE_NAME, customLog),
        level: customLogConfig.level,
        label: customLogConfig.label
      }))
      logger.log(`Logování speciálních logů '${customLog}' je aktivní.`);
    }
  } else {
    logger.log('Logování do souboru není aktivní.');
  }

  const loggerOpts: LoggerOptions = {
    levels: config.levels,
    transports: transportStreams
  };

  const winston: WinstonLogger = createLogger(loggerOpts);

  return new Logger(winston);
};
