import * as path from 'path';

import { readDirectoryRecursive } from './tools-helper';

const MMD_SUFFIX = '.mmd';
const IMG_SUFFIX = '.png';
const IMG_PATH_SEPARATOR = '__';
const root = path.dirname(__dirname);
const libs = path.join(root, 'libs');
const output = path.join(root, 'graphs');
const abandonedFileParts = ['libs', 'src', 'lib', 'handlers', 'impl'];

/**
 * Transformuje relativní cestu k souboru na název souboru
 *
 * libs\\stim-feature-experiments\\application\\src\\lib\\services\\graph.mmd
 * => stim_feature_experiments__application__services__graph
 *
 * @param filePath
 */
function transformFileName(filePath: string): string {
  let fileParts: string[] = filePath.split(path.sep);
  fileParts = fileParts.filter(part => !abandonedFileParts.includes(part))
                       .map(part => part.replace(/-/g, '_'));

  return fileParts.join(IMG_PATH_SEPARATOR);
}

/**
 * Vygeneruje obrázky všech nalezených grafů.
 *
 * @param graphFilePath Cesta ke grafu
 */
function generateGraph(graphFilePath: string): void {
  const fileName = transformFileName(graphFilePath).replace(MMD_SUFFIX, IMG_SUFFIX);
  const cmd = `npx mmdc -i ${graphFilePath} -o ${path.join(output, fileName)}`;
  console.log(cmd);
}

const files = readDirectoryRecursive(libs, MMD_SUFFIX, root);

files.forEach(generateGraph);
