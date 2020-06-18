import * as fs from 'fs';
import { environment } from 'apps/server/src/environments/environment';

const TOTAL_OUTPUT_COUNT = environment.totalOutputCount;

const schemaTemplates = fs.readdirSync('apps/server/schemas/templates');
const triggerTemplates = fs.readdirSync('apps/server/triggers/templates');

console.log(
  `Generuji schemata z templatů pro ${TOTAL_OUTPUT_COUNT} výstupů...`
);
schemaTemplates.forEach((template: string) => {
  console.log(`\tzpracovávám template schema: '${template}'`);
  const templateContent = fs.readFileSync(
    `apps/server/schemas/templates/${template}`,
    {
      encoding: 'utf-8',
    }
  );
  const newContent = templateContent.replace(
    /\$TOTAL_OUTPUT_COUNT\$/g,
    `${TOTAL_OUTPUT_COUNT}`
  );
  fs.writeFileSync(
    `apps/server/schemas/${template.replace('-template', '')}`,
    newContent,
    {
      encoding: 'utf-8',
    }
  );
});

console.log('Generuji zbývající triggery z templatů...');
triggerTemplates.forEach((template: string) => {
  console.log(`\tzpracovávám template trigger: '${template}'`);
  const BEGIN = '{BEGIN}';
  const END = '{END}';
  const INDEX = '{INDEX}';
  const experimentType = template.substr(4).substring(0, 4).replace('_', '');
  const templateContent = fs.readFileSync(
    `apps/server/triggers/templates/${template}`,
    {
      encoding: 'utf-8',
    }
  );
  const cycleContent = templateContent.substring(
    templateContent.indexOf(BEGIN) + BEGIN.length,
    templateContent.indexOf(END)
  );
  let newContent = templateContent.substring(0, templateContent.indexOf(BEGIN));

  for (let i = 0; i < TOTAL_OUTPUT_COUNT; i++) {
    newContent += cycleContent.replace(INDEX, `${i}`);
    newContent += '\n\t';
  }

  newContent += templateContent.substring(
    templateContent.indexOf(END) + END.length,
    templateContent.length
  );
  fs.writeFileSync(
    `apps/server/triggers/${template.replace('-template', '')}`,
    newContent,
    { encoding: 'utf-8' }
  );
});
