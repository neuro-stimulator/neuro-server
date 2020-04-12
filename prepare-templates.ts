import 'dotenv/config';
import * as fs from 'fs';

import { TOTAL_OUTPUT_COUNT } from './src/config/config';

const schemaTemplates = fs.readdirSync('schemas/templates');
const triggerTemplates = fs.readdirSync('triggers/templates');
const indexAdditionByExperimentType = {
  erp: 1,
  fvep: 0,
  tvep: 0,
};

console.log('Generuji schemata z templatů...');
schemaTemplates.forEach((template: string) => {
  console.log(`\tzpracovávám template schema: '${template}'`);
  const templateContent = fs.readFileSync(`schemas/templates/${template}`, { encoding: 'utf-8' });
  const newContent = templateContent.replace(/\$TOTAL_OUTPUT_COUNT\$/g, `${TOTAL_OUTPUT_COUNT}`);
  fs.writeFileSync(`schemas/${template.replace('-template', '')}`, newContent, { encoding: 'utf-8' });
});

console.log('Generuji zbývající triggery z templatů...');
triggerTemplates.forEach((template: string) => {
  console.log(`\tzpracovávám template trigger: '${template}'`);
  const BEGIN = '{BEGIN}';
  const END = '{END}';
  const INDEX = '{INDEX}';
  const experimentType = template.substr(4).substring(0, 4).replace('_', '');
  const templateContent = fs.readFileSync(`triggers/templates/${template}`, { encoding: 'utf-8' });
  const cycleContent = templateContent.substring(templateContent.indexOf(BEGIN) + BEGIN.length, templateContent.indexOf(END));
  let newContent = templateContent.substring(0, templateContent.indexOf(BEGIN));

  for (let i = 0; i < TOTAL_OUTPUT_COUNT + indexAdditionByExperimentType[experimentType]; i++) {
    newContent += cycleContent.replace(INDEX, `${i}`);
    newContent += '\n\t';
  }

  newContent += templateContent.substring(templateContent.indexOf(END) + END.length, templateContent.length);
  fs.writeFileSync(`triggers/${template.replace('-template', '')}`, newContent, { encoding: 'utf-8'});
});
fs.unlinkSync('prepare-templates.js');
