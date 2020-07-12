/* SOURCE: https://github.com/facebook/jest/issues/2418#issuecomment-478932514 */
/* tslint:disable:no-console */
/*
ts-node ./merge-coverage.ts --report ./coverage0/coverage-final.json --report ./coverage1/coverage-final.json
*/

import * as fs from 'fs-extra';
import { createReporter } from 'istanbul-api';
import { createCoverageMap } from 'istanbul-lib-coverage';
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

async function main() {
  const reportFiles = readDirectoryRecursive('coverage', 'coverage-final.json', '');
  const reporters = ['json', 'lcov'];

  const map = createCoverageMap({});

  reportFiles.forEach((file) => {
    const r = fs.readJsonSync(file);
    map.merge(r);
  });

  const reporter = createReporter();
  await reporter.addAll(reporters);
  reporter.write(map);
  console.log('Created a merged coverage report in ./coverage');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
