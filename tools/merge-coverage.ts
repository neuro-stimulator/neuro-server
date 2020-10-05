/* SOURCE: https://github.com/facebook/jest/issues/2418#issuecomment-478932514 */
/* tslint:disable:no-console */
/*
ts-node ./merge-coverage.ts --report ./coverage0/coverage-final.json --report ./coverage1/coverage-final.json
*/

import * as fs from 'fs-extra';
import { createReporter } from 'istanbul-api';
import { createCoverageMap } from 'istanbul-lib-coverage';

import { readDirectoryRecursive } from './tools-helper';

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
