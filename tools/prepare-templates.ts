import * as fs from 'fs';
import * as path from 'path';
import { environment } from '../apps/server/src/environments/environment';

const TOTAL_OUTPUT_COUNT = environment.totalOutputCount;
const serverRoot = path.join('apps', 'server');
const serverDistRoot = path.join('dist', 'apps', 'server');
const schemasSourceFolder = path.join(serverRoot, 'schemas');
const triggersSourceFolder = path.join(serverRoot, 'triggers');
const schemasOutputFolder = path.join(serverDistRoot, 'private', 'schemas');
const triggersOutputFolder = path.join(serverDistRoot, 'private', 'triggers');

fs.mkdirSync(schemasOutputFolder, { recursive: true });
fs.mkdirSync(triggersOutputFolder, { recursive: true });

const schemaTemplates = fs.readdirSync(schemasSourceFolder);
const triggerTemplates = fs.readdirSync(triggersSourceFolder);

console.log(
  `Generuji schemata z templatů pro ${TOTAL_OUTPUT_COUNT} výstupů...`
);
schemaTemplates.forEach((template: string) => {
  console.log(`\tzpracovávám template schema: '${template}'`);
  const templateContent = fs.readFileSync(
    path.join(schemasSourceFolder, template),
    {
      encoding: 'utf-8',
    }
  );
  const newContent = templateContent.replace(
    /\$TOTAL_OUTPUT_COUNT\$/g,
    `${TOTAL_OUTPUT_COUNT}`
  );
  fs.writeFileSync(path.join(schemasOutputFolder, template), newContent, {
    encoding: 'utf-8',
  });
});

console.log('Generuji triggery z templatů...');
triggerTemplates.forEach((template: string) => {
  console.log(`\tzpracovávám template trigger: '${template}'`);
  const BEGIN = '{BEGIN}';
  const END = '{END}';
  const INDEX = '{INDEX}';
  const templateContent = fs.readFileSync(
    path.join(triggersSourceFolder, template),
    {
      encoding: 'utf-8',
    }
  );

  // Pokud template neobsahuje žádnou značku begin
  if (templateContent.indexOf(BEGIN) === -1) {
    fs.writeFileSync(
      path.join(triggersOutputFolder, template),
      templateContent,
      { encoding: 'utf-8' }
    );
    return;
  }

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
  fs.writeFileSync(path.join(triggersOutputFolder, template), newContent, {
    encoding: 'utf-8',
  });
});
