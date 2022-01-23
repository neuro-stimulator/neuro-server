import { ConsoleTransportOptions as WinstonConsoleTransportOptions } from 'winston/lib/winston/transports';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

interface CustomTransportOptions {
  label?: string;
}

export interface ConsoleTransportOptions extends WinstonConsoleTransportOptions, CustomTransportOptions {}

export type FileTransportOptions = DailyRotateFileTransportOptions & CustomTransportOptions;
