import * as fg from 'fast-glob';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Rekurzivně projde zadanou složku a vyhledá veškeré HTML soubory
 *
 * @param dir Složka, která se má procházet
 * @param fileExtention Koncovka souboru, který se má vyfiltrovat
 */
function readDirectoryRecursive(
  dir: string,
  fileExtention: string,
  relativeDir
): string[] {
  const files = [];
  const entries: string[] = fs.readdirSync(dir, {
    encoding: 'utf-8',
  }) as string[];
  for (const entry of entries) {
    const filePath = `${dir}/${entry}`;
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      files.push(
        ...readDirectoryRecursive(filePath, fileExtention, relativeDir)
      );
    } else if (stats.isFile() && entry.endsWith(fileExtention)) {
      const entityPath = path
        .relative(relativeDir, filePath)
        .replace(/\.ts$/, '');
      files.push(path.normalize(entityPath));
    }
  }

  return files;
}

function createEntitiesIndex() {
  console.log('Creating entity-index.ts for server');
  const src = `${path.dirname(__dirname)}/apps/server/src/app`;
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
  const entities = readDirectoryRecursive(src, 'entity.ts', outDir);

  for (const entity of entities) {
    const data = `export * from "${entity.replace(/\\/g, '/')}"\n`;
    fs.writeFileSync(tmpFile, data, { flag: 'a+' });
  }

  // for (const item of fg.sync(`${src}/**/*.{entity.ts}`)) {
  //   // src/**/*.{css,scss}
  //   const filePath = path.relative(outDir, item).replace(/\.ts$/, '');
  //   console.log(filePath);
  //   const data = `export * from '${filePath}'\n`;
  //   fs.writeFileSync(tmpFile, data, { flag: 'a+' });
  // }

  if (fs.existsSync(outFile) && fs.existsSync(tmpFile)) {
    fs.unlinkSync(outFile);
    console.log(`Old file '${outFile}' removed`);
  }
  if (fs.existsSync(tmpFile)) {
    fs.renameSync(tmpFile, outFile);
    console.log(`New file ${outFile} saved`);
  }
}
createEntitiesIndex();
