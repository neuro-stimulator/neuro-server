import * as fs from 'fs';
import * as path from 'path';

import { readLibFiles } from './tools-helper';

const regex = /@Controller\('(.*)'\)$/gm;
const endpointsFileTemplate = `export const ENDPOINTS = $ENDPOINTS$;\n`;

function createEntitiesIndex() {
  console.log('Extracting entry points from controllers');
  const tsconfig = `${path.dirname(__dirname)}/tsconfig.base.json`;
  const paths = JSON.parse(fs.readFileSync(tsconfig, { encoding: 'utf-8' })).compilerOptions.paths;
  const testHelpersRoot = `${path.dirname(__dirname)}/apps/server/test/helpers`;
  const libs = `${path.dirname(__dirname)}/libs`;
  const tmpFile = `${testHelpersRoot}/tmp-endpoints.ts`;
  const endpointsFile = `${testHelpersRoot}/endpoints.ts`;

  if (!fs.existsSync(testHelpersRoot)) {
    console.log(`App api cannot be found. Path not exist: ${testHelpersRoot}`);
    process.exit(1);
  }
  const moduleWithController: Record<string, string[]> = readLibFiles(Object.keys(paths), libs, 'controller.ts', libs);

  const endpoints: Record<string, string> = {};

  for (const key of Object.keys(moduleWithController)) {
    const controllers = moduleWithController[key];
    if (controllers.length === 0) {
      continue;
    }

    for (const controllerPath of controllers) {
      const controller = fs.readFileSync(path.join(libs, controllerPath + '.ts')).toString();
      const regexResult = regex.exec(controller);
      const controllerName = controllerPath.substring(controllerPath.lastIndexOf(path.sep)+1).replace('.controller', '');
      endpoints[controllerName] = regexResult && regexResult[1] || '';
    }
  }

  fs.writeFileSync(tmpFile, endpointsFileTemplate.replace('$ENDPOINTS$', JSON.stringify(endpoints).replace(/","/gm, "\",\n\"")), { flag: 'a+' });

  fs.writeFileSync(tmpFile, `\n`, { flag: 'a+'});

  for (const endpointKey of Object.keys(endpoints)) {
    const endpointName = endpointKey.toUpperCase().replace(/-/gm, "_");
    fs.writeFileSync(tmpFile, `export const ${endpointName} = '${endpointKey}';\n`, { flag: 'a+'});
  }

  if (fs.existsSync(tmpFile)) {
    fs.renameSync(tmpFile, endpointsFile);
    console.log(`New file ${endpointsFile} saved`);
  }

}

createEntitiesIndex();
