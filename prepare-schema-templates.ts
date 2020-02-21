import 'dotenv/config';

import { TOTAL_OUTPUT_COUNT } from './src/config/config';
import * as fs from 'fs';

const schemaTemplates = fs.readdirSync('schemas/templates');

schemaTemplates.forEach(template => {
  console.log(`Zpracovávám template: '${template}'`);
  const templateContent = fs.readFileSync(`schemas/templates/${template}`, { encoding: 'utf-8' });
  const newContent = templateContent.replace(/\$TOTAL_OUTPUT_COUNT\$/g, `${TOTAL_OUTPUT_COUNT}`);
  fs.writeFileSync(`schemas/${template.replace('-template', '')}`, newContent, { encoding: 'utf-8' });
});

fs.unlinkSync('prepare-schema-templates.js');
