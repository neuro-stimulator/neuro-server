import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';

import { FileRecord } from 'diplomka-share';

import { FILE_BROWSER_BASE_PATH } from '../config/config';
import { UploadedFileStructure } from '../share/utils';

@Injectable()
export class FileBrowserService {

  // Lokální kopie výchozí cesty k souborům aplikace
  private static readonly BASE_PATH = FILE_BROWSER_BASE_PATH;
  // Identifikátor privátních souborů
  private static readonly PRIVATE_SPACE = 'private';
  // Identifikátor veřejně dostupných souborů
  private static readonly PUBLIC_SPACE = 'public';
  // Cesta k privátní složce
  private static readonly PRIVATE_PATH = `${FileBrowserService.BASE_PATH}${path.sep}${FileBrowserService.PRIVATE_SPACE}`;
  // Cesta k veřejné složce
  private static readonly PUBLIC_PATH = `${FileBrowserService.BASE_PATH}${path.sep}${FileBrowserService.PUBLIC_SPACE}`;

  private readonly logger: Logger = new Logger(FileBrowserService.name);

  constructor() {
    this.createDirectory(FileBrowserService.PRIVATE_PATH).finally();
    this.createDirectory(FileBrowserService.PUBLIC_PATH).finally();
  }

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
    return path.join(this.PUBLIC_PATH, ...subfolders);
  }

  /**
   * Spojí jednotlivé části cesty pomocí separátoru
   *
   * @param subfolders Podsložky, které mají utvořit výslednou cestu
   * @return Cestu k privátnímu souboru
   */
  public static mergePrivatePath(...subfolders: string[]) {
    return path.join(this.PRIVATE_PATH, ...subfolders);
  }

  /**
   * Metoda rekurzivně projede zadanou cestu a smaže všechno, co jí příjde do cesty
   *
   * @param parentPath string Cesta k souboru/složce
   */
  public recursiveDelete(parentPath: string) {
    // Získám statistiky o mazaném souboru/složce
    const parentFileStats = fs.statSync(parentPath);
    // Pokud se jedná o složku
    if (parentFileStats.isDirectory()) {
      this.logger.debug(`Mažu vše, co existuje ve složce: '${parentPath}'.`);
      // Získám obsah složky
      const files: string[] = fs.readdirSync(parentPath);
      // Proiteruji přes všechny záznamy, co najdu ve složce
      for (const file of files) {
        // Rekurzivně smažu všechny záznamy
        this.recursiveDelete(path.join(parentPath, file));
      }
      this.logger.verbose(`Mažu prázdnou složku: '${parentPath}'.`);
      // Nakonec vím, že je složka prázdná, tak ji můžu bezpečně smazat
      fs.rmdirSync(parentPath);
    } else if (parentFileStats.isFile()) {
      this.logger.verbose(`Mažu soubor: '${parentPath}'.`);
      // Smažu soubor
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
      // Přečtu obsah složky
      const files: string[] = await fs.promises.readdir(dir);

      // Pomocí volání funkce 'map' přeměním string[] na FileRecord[]
      return files.map(file => {
        // Získám plnou cestu k souboru
        const fullPath = FileBrowserService.mergePublicPath(file);
        // Získám statistiku o souboru
        const stats = fs.statSync(fullPath);
        // Uložím si, zda-li se jedná o složku
        const isDirectory = stats.isDirectory();
        // Pokud se jedná o soubor, uložím si i jeho příponu
        const extention = isDirectory ? '' : path.extname(fullPath).replace('.', '');

        // Následně vyplním požadovanou strukturu
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
    // Zkontroluji, zda-li již složka existuje
    if (!fs.existsSync(dirPath)) {
      // Složka neexistuje, tak ji půjdu vytvořit
      this.logger.verbose(`Vytvářím složku: ${dirPath}.`);
      try {
        // Vytvářím novou složku
        await fs.promises.mkdir(dirPath);
      } catch (e) {
        this.logger.error(e);
        // Nastala chyba. Pokud mám vyhodit vyjímku
        if (throwException) {
          // Tak ji i vyhodím
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
  public async hashFile(filePath: string) {
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
    // Sestavím veřejnou cestu ke složce
    const destFolderPath = FileBrowserService.mergePublicPath(destFolder);
    // Pokud taková složka neexistuje
    if (!fs.existsSync(destFolderPath)) {
      // Vyhodím chybu, je potřeba složku nejdříve vytvořit
      throw new Error(`Cílová složka: '${destFolderPath}' neexistuje!`);
    }

    // Projdu postupně všechny nahrané soubory
    for (const file of files) {
      // Sestavím cílovou cestu k souboru
      const destPath = FileBrowserService.mergePublicPath(destFolder, file.originalname);
      this.logger.debug(`Přesouvám nahraný soubor z původní cesty: ${file.path} na nové místo: ${destPath}.`);
      // Pomocí přejmenování souboru ho vlastně i přesunu na zvolené místo
      await this.rename(file.path, destPath);
    }
  }
}
