import { Format } from 'logform';
import { format as WinstonFormat } from 'winston';

export const customFormatter = (logDateTimeFormat: string, pid: number): Format =>

  WinstonFormat.combine(
    WinstonFormat.timestamp({ format: logDateTimeFormat }),
    WinstonFormat.ms(),
    WinstonFormat.printf(({ context, level, timestamp, message, ms }) => {
      return (
        ('undefined' !== typeof timestamp ? `${timestamp} ` : '') +
        `${ms} ` +
        `<${pid}> ` +
        `${level?.toUpperCase()} ` +
        ('undefined' !== typeof context ? `[${context}] ` : '') +
        message
      );
    })
  );
