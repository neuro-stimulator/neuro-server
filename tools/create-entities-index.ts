import * as fs from 'fs';
import * as path from 'path';

import { readLibFiles } from './tools-helper';

function createEntitiesIndex() {
  console.log('Creating entity-index.ts for server');
  const tsconfig = `${path.dirname(__dirname)}/tsconfig.base.json`;
  const paths = JSON.parse(fs.readFileSync(tsconfig, { encoding: 'utf-8' })).compilerOptions.paths;
  const src = `${path.dirname(__dirname)}/apps/server/src/app`;
  const libs = `${path.dirname(__dirname)}/libs`;
  if (!fs.existsSync(src)) {
    console.log(`App api cannot be found. Path not exist: ${src}`);
    process.exit(1);
  }
  const outDir = `${src}/database`;
  const tmpFile = `${outDir}/tmp-entities-index.ts`;
  const outFile = `${outDir}/entities-index.ts`;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  const entities: Record<string, string[]> = readLibFiles(Object.keys(paths), libs, 'entity.ts', outDir);

  const libraries = [];
  for (const entityKey of Object.keys(entities)) {
    if (entities[entityKey].length === 0) continue;
    const data = `import { ENTITIES as ${entityKey.replace(/[-/]/g, '')} } from '@diplomka-backend/${entityKey}'\n`;
    libraries.push(`...${entityKey.replace(/[-/]/g, '')}`);
    fs.writeFileSync(tmpFile, data, { flag: 'a+' });
  }

  const exportData = `export const ENTITIES = [\n${libraries.join(',\n')}\n];`;
  fs.writeFileSync(tmpFile, exportData, { flag: 'a+' });

  if (fs.existsSync(tmpFile)) {
    fs.renameSync(tmpFile, outFile);
    console.log(`New file ${outFile} saved`);
  }
}
createEntitiesIndex();
