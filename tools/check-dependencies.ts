import * as path from 'path';
import * as fs from 'fs';

async function checkFile(library: string, file: string) {
  const content = fs.readFileSync(file, { encoding: 'utf-8' });
  if (content.indexOf(`@diplomka-backend/${library}`) !== -1) {
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

async function run() {
  const libraryDirName = 'libs';
  const libraryDir = path.join(__dirname, '../', libraryDirName);
  const libraries: string[] = fs.readdirSync(libraryDir);

  for (const library of libraries) {
    const libraryPath = path.join(libraryDir, library);
    const srcLibDir = path.join(libraryPath, 'src', 'lib');
    if (!fs.lstatSync(libraryPath).isDirectory()) continue;

    await checkFilesInRecursion(library, srcLibDir, '.ts');
  }
}

run().catch((error) => console.log(error));
