import * as fs from 'fs';
import * as path from 'path';

const TOTAL_OUTPUT_COUNT = 8;
const serverRoot = path.join('apps', 'server');
const serverDistRoot = path.join('dist', 'apps', 'server');
const triggersSourceFolder = path.join(serverRoot, 'triggers');
const dataContainersFolder = path.join(serverRoot, 'data-containers');
const triggersOutputFolder = path.join(serverDistRoot, 'private', 'triggers');
const dataContainersOutputFolder = path.join(serverDistRoot, 'private', 'data-containers');

fs.mkdirSync(triggersOutputFolder, { recursive: true });
fs.mkdirSync(dataContainersOutputFolder, { recursive: true });

const triggerTemplates = fs.readdirSync(triggersSourceFolder);
const dataContainers = fs.readdirSync(dataContainersFolder);

console.log('Generuji triggery z templatů...');
triggerTemplates.forEach((template: string) => {
  console.log(`\tzpracovávám template trigger: '${template}'`);
  const BEGIN = '{BEGIN}';
  const END = '{END}';
  const INDEX = '{INDEX}';
  const templateContent = fs.readFileSync(path.join(triggersSourceFolder, template), {
    encoding: 'utf-8',
  });

  // Pokud template neobsahuje žádnou značku begin
  if (templateContent.indexOf(BEGIN) === -1) {
    fs.writeFileSync(path.join(triggersOutputFolder, template), templateContent, { encoding: 'utf-8' });
    return;
  }

  const cycleContent = templateContent.substring(templateContent.indexOf(BEGIN) + BEGIN.length, templateContent.indexOf(END));
  let newContent = templateContent.substring(0, templateContent.indexOf(BEGIN));

  for (let i = 0; i < TOTAL_OUTPUT_COUNT; i++) {
    newContent += cycleContent.replace(INDEX, `${i}`);
    newContent += '\n\t';
  }

  newContent += templateContent.substring(templateContent.indexOf(END) + END.length, templateContent.length);
  fs.writeFileSync(path.join(triggersOutputFolder, template), newContent, {
    encoding: 'utf-8',
  });
});

console.log('Kopíruji data kontejnery...');
dataContainers
  .filter((file: string) => file.endsWith('.json'))
  .forEach((file: string) => {
    console.log(`\tKopíruji data kontejner: ${file}`);
    fs.copyFileSync(path.join(dataContainersFolder, file), path.join(dataContainersOutputFolder, file));
  });
