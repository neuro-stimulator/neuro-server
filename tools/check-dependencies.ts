import * as path from 'path';
import * as fs from 'fs';

async function checkFile(library: string, file: string) {
  const content = fs.readFileSync(file, { encoding: 'utf-8' });
  if (content.indexOf(`@diplomka-backend/${library}`) !== -1 && file.indexOf(path.normalize(library)) !== -1) {
    console.log('Byl nalezen soubor, který se odkazuje na vlastní index!');
    console.log(`\t${file}`);
  }
}

async function checkFilesInRecursion(library: string, dir: string, extention: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      await checkFilesInRecursion(library, filePath, extention);
    } else if (stats.isFile() && file.endsWith(extention)) {
      await checkFile(library, filePath);
    }
  }
}

async function checkLibraries(libraries: string[], dir: string, extention: string) {
  libraries = libraries.filter((name) => name.startsWith('@diplomka-backend')).map((name) => name.replace('@diplomka-backend/', ''));

  for (const library of libraries) {
    await checkFilesInRecursion(library, dir, extention);
  }
}

async function run() {
  const tsconfig = `${path.dirname(__dirname)}/tsconfig.json`;
  const paths = JSON.parse(fs.readFileSync(tsconfig, { encoding: 'utf-8' })).compilerOptions.paths;
  const libs = `${path.dirname(__dirname)}/libs`;
  await checkLibraries(Object.keys(paths), libs, '.ts');
}

run().catch((error) => console.log(error));
