import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';

import { FileRecord } from 'diplomka-share';
import { UploadedFileStructure } from '../share/utils';

@Injectable()
export class FileBrowserService {

  private static readonly BASE_PATH = `${path.sep}tmp`;
  private static readonly PRIVATE_SPACE = 'private';
  private static readonly PUBLIC_SPACE = 'public';
  private static readonly PRIVATE_PATH = `${FileBrowserService.BASE_PATH}${path.sep}${FileBrowserService.PRIVATE_SPACE}`;
  private static readonly PUBLIC_PATH = `${FileBrowserService.BASE_PATH}${path.sep}${FileBrowserService.PUBLIC_SPACE}`;

  private readonly logger: Logger = new Logger(FileBrowserService.name);

  /**
   * Spojí jednotlivé části cesty pomocí separátoru
   *
   * @param subfolders Podsložky, které mají utvořit výslednou cestu
   * @return Podsložky spojené separátorem
   */
  public static mergePath(...subfolders: string[]) {
    return path.join(...subfolders);
  }

  /**
   * Spojí jednotlivé části cesty pomocí separátoru
   *
   * @param subfolders Podsložky, které mají utvořit výslednou cestu
   * @return Cestu k veřejně dostupnému souboru
   */
  public static mergePublicPath(...subfolders: string[]) {
    return path.join(this.BASE_PATH, this.PUBLIC_SPACE, ...subfolders);
  }

  /**
   * Spojí jednotlivé části cesty pomocí separátoru
   *
   * @param subfolders Podsložky, které mají utvořit výslednou cestu
   * @return Cestu k privátnímu souboru
   */
  public static mergePrivatePath(...subfolders: string[]) {
    return path.join(this.BASE_PATH, this.PRIVATE_SPACE, ...subfolders);
  }

  /**
   * Metoda rekurzivně projede zadanou cestu a smaže všechno, co jí příjde do cesty
   *
   * @param parentPath string Cesta k souboru/složce
   */
  public recursiveDelete(parentPath: string) {
    const parentFileStats = fs.statSync(parentPath);
    if (parentFileStats.isDirectory()) {
      this.logger.debug(`Mažu vše, co existuje ve složce: '${parentPath}'.`);
      const files: string[] = fs.readdirSync(parentPath);
      for (const file of files) {
        this.recursiveDelete(path.join(parentPath, file));
      }
      this.logger.verbose(`Mažu prázdnou složku: '${parentPath}'.`);
      fs.rmdirSync(parentPath);
    } else if (parentFileStats.isFile()) {
      this.logger.verbose(`Mažu soubor: '${parentPath}'.`);
      fs.unlinkSync(parentPath);
    }

  }

  /**
   * Metoda pro přesun souborů z jedné složky do druhé. Funguje rekurzivně
   *
   * @param sourceDir string Zdrojová složky - odkud se mají soubory přesunout
   * @param destDir string cílová složka - kam se mají soubory přesunout
   * @throws FileManipulationException Pokud zdroj nebo cíl není složka
   */
  public async moveFiles(sourceDir: string, destDir: string) {

  }

  /**
   * Metoda pro získání obsahu z adresáře
   *
   * @param dir Cesta k adresáři
   * @return array Pole souborů
   */
  public async getFilesFromDirectory(dir: string): Promise<FileRecord[]> {
    this.logger.debug(`Vybírám soubory ze složky: ${dir}.`);
    try {
      const files: string[] = await fs.promises.readdir(dir);

      return files.map(file => {
        const fullPath = FileBrowserService.mergePublicPath(file);
        const stats = fs.statSync(fullPath);
        const isDirectory = stats.isDirectory();
        const extention = isDirectory ? '' : path.extname(fullPath).replace('.', '');

        return {
          name: file,
          path: fullPath.replace(`${FileBrowserService.PUBLIC_PATH}${path.sep}`, '')
                        .replace('\\', '/'),
          isDirectory,
          isImage: !isDirectory && extention === 'png',
          extention,
          hash: '', // this.hashFile(fullPath),
          selected: false,
        };
      });
    } catch (e) {
      // -2 = složka neobsahuje žádné soubory
      if (e.errno === -2) {
        this.logger.debug(`Zadaná složka: '${dir}' neobsahuje žádné soubory.`);
        return [];
      }

      throw new Error(e);
    }
  }

  /**
   * Pomocná metoda pro vytvoření složky, pokud neexistuje
   *
   * @param dirPath Cesta ke složce
   * @param throwException True, pokud se má při nezdaru vyhodit vyjímka
   */
  public async createDirectory(dirPath: string, throwException: boolean = false) {
    if (!fs.existsSync(dirPath)) {
      this.logger.verbose(`Vytvářím složku: ${dirPath}.`);
      try {
        await fs.promises.mkdir(dirPath);
      } catch (e) {
        if (throwException) {
          this.logger.error(e);
          throw new Error('Složku se nepodařilo vytvořit!');
        }
      }
    }
  }

  /**
   * Vrátí hash (sha1) souboru
   *
   * @param filePath Cesta k souboru
   * @return false|string false v případě, že se hash nepodařilo vytvořit, nebo hash
   */
  public hashFile(filePath: string) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha1');
      const stream = fs.createReadStream(filePath);
      stream.on('error', err => reject(err));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  /**
   * Přečte soubor a vrátí obsah
   *
   * @param filePath Cesta k souboru
   * @return Obsah souboru
   */
  public readFile(filePath: string) {
    return fs.createReadStream(filePath);
  }

  /**
   * Odstraní soubor v parametru
   *
   * @param filePath Cesta k souboru, který se má odstranit
   * @throws FileManipulationException
   */
  public async deleteFile(filePath: string) {

  }

  /**
   * Přejmenuje soubor na nový název
   *
   * @param oldPath Originální cesta k souboru
   * @param newPath Nová cesta k souboru
   */
  public async rename(oldPath: string, newPath: string) {
    await fs.promises.rename(oldPath, newPath);
  }

  /**
   * Zkontroluje, zda-li zadaný soubor existuje
   *
   * @param filePath Cesta k testovanému souboru
   * @return bool True, pokud soubor existuje, jinak false
   */
  public async existsFile(filePath: string) {

  }

  /**
   * Zjistí, zda-li se na zadané cestě nachází složka, nebo soubor
   *
   * @param filePath Kontrolovaná cesta
   */
  public isDirectory(filePath: string) {
    return fs.statSync(filePath).isDirectory();
  }

  /**
   * Vrátí rodičovskou složku na zadané cestě
   *
   * @param filePath Cesta ke koncové složce/souboru
   */
  public getParentDirectory(filePath: string) {
    return path.dirname(filePath).split(path.sep).pop();
  }

  /**
   * Uloží všechny nahrané soubory do cílové složky
   *
   * @param files Nahrané soubory
   * @param destFolder Plná cesta k cílové složce
   */
  public async saveFiles(files: UploadedFileStructure[], destFolder: string) {
    const destFolderPath = FileBrowserService.mergePublicPath(destFolder);
    if (!fs.existsSync(destFolderPath)) {
      throw new Error(`Cílová složka: '${destFolderPath}' neexistuje!`);
    }

    for (const file of files) {
      const destPath = FileBrowserService.mergePublicPath(destFolder, file.originalname);
      this.logger.debug(`Přesouvám nahraný soubor z původní cesty: ${file.path} na nové místo: ${destPath}.`);
      await this.rename(file.path, destPath);
    }
  }
}
