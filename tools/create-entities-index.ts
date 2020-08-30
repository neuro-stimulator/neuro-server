import * as fs from 'fs';
import * as path from 'path';

/**
 * Rekurzivně projde zadanou složku a vyhledá veškeré HTML soubory
 *
 * @param dir Složka, která se má procházet
 * @param fileExtention Koncovka souboru, který se má vyfiltrovat
 */
function readDirectoryRecursive(dir: string, fileExtention: string, relativeDir): string[] {
  const files = [];
  const entries: string[] = fs.readdirSync(dir, {
    encoding: 'utf-8',
  }) as string[];
  for (const entry of entries) {
    const filePath = `${dir}/${entry}`;
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      files.push(...readDirectoryRecursive(filePath, fileExtention, relativeDir));
    } else if (stats.isFile() && entry.endsWith(fileExtention)) {
      const entityPath = path.relative(relativeDir, filePath).replace(/\.ts$/, '');
      files.push(path.normalize(entityPath));
    }
  }

  return files;
}

function readLibEntities(libraries: string[], dir: string, fileExtention: string, relativeDir): { [name: string]: string[] } {
  libraries = libraries.filter((name) => name.startsWith('@diplomka-backend')).map((name) => name.replace('@diplomka-backend/', ''));
  const out = {};
  // const libraries = fs.readdirSync(dir);

  for (const libraryName of libraries) {
    // if (!libraryName.startsWith('stim')) continue;
    out[libraryName] = readDirectoryRecursive(path.join(dir, libraryName), fileExtention, relativeDir);
  }
  return out;
}

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
  const entities: { [name: string]: string[] } = readLibEntities(Object.keys(paths), libs, 'entity.ts', outDir);

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
