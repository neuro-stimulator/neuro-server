import * as fs from 'fs';
import * as path from 'path';

/**
 * Rekurzivně projde zadanou složku a vyhledá veškeré HTML soubory
 *
 * @param dir Složka, která se má procházet
 * @param fileExtention Koncovka souboru, který se má vyfiltrovat
 * @param relativeDir
 */
export function readDirectoryRecursive(dir: string, fileExtention: string, relativeDir: string): string[] {
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

export function readLibFiles(libraries: string[], dir: string, fileExtention: string, relativeDir: string): Record<string, string[]> {
  libraries = libraries.filter((name) => name.startsWith('@neuro-server')).map((name) => name.replace('@neuro-server/', ''));
  const out: Record<string, string[]> = {};

  for (const libraryName of libraries) {
    out[libraryName] = readDirectoryRecursive(path.join(dir, libraryName), fileExtention, relativeDir);
  }
  return out;
}
