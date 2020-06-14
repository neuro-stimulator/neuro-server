import * as fs from 'fs';

import { Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';

/**
 * Inicializuje triggery potřebné pro správný chod databáze
 *
 * @param logger Logger
 */
export async function initDbTriggers(logger?: Logger) {
  if (logger) {
    logger.log('Inicializuji triggery...');
  }

  // Přečtu synchroně obsah složky s triggrama
  const files: string[] = fs
    .readdirSync('apps/server/triggers')
    .filter((file: string) => file.endsWith('trigger.sql'));
  // Získám spojení s databází
  const connection = getConnection();
  // Projdu jednotlivé soubory
  for (const file of files) {
    // Načtu jejich obsah
    const content = fs.readFileSync(`apps/server/triggers/${file}`);
    if (logger) {
      logger.log(`Aplikuji trigger ze souboru: ${file}`);
    }
    // Nechám trigger zaregistrovat
    await connection.query(content.toString());
  }
}
