import * as fs from 'fs';
import { getConnection } from 'typeorm';
import { Logger } from '@nestjs/common';

export async function initDbTriggers(logger?: Logger) {
  if (logger) {
    logger.log('Inicializuji triggery...');
  }

  const files: string[] = fs.readdirSync('triggers').filter(file => file.endsWith('trigger.sql'));
  const connection = getConnection();
  for (const file of files) {
    const content = fs.readFileSync(`triggers/${file}`);
    if (logger) {
      logger.log(`Aplikuji trigger ze souboru: ${file}`);
    }
    await connection.query(content.toString());
  }
}
