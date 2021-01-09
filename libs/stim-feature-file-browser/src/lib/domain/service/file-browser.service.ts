import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { imageSize } from 'image-size';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { FileRecord } from '@stechy1/diplomka-share';

import { TOKEN_BASE_PATH } from '../tokens/tokens';
import { FileAccessRestrictedException } from '../exception/file-access-restricted.exception';
import { FileNotFoundException } from '../exception/file-not-found.exception';
import { FolderIsUnableToCreateException } from '../exception/folder-is-unable-to-create.exception';
import { FileLocation } from '../model/file-location';
import { ContentWasNotWrittenException } from '../exception/content-was-not-written.exception';

@Injectable()
export class FileBrowserService {
  // Identifikátor privátních souborů
  private readonly privateSpace = 'private';
  // Identifikátor veřejně dostupných souborů
  private readonly publicSpace = 'public';
  // Cesta k privátní složce
  private readonly _privatePath = path.join(this.basePath, this.privateSpace);
  // Cesta k veřejné složce
  private readonly _publicPath = path.join(this.basePath, this.publicSpace);

  private readonly logger: Logger = new Logger(FileBrowserService.name);

  constructor(@Inject(TOKEN_BASE_PATH) private readonly basePath: string) {
    this.logger.verbose(`Základní cesta ke všem souborům je: '${this.basePath}'.`);
    this.createDirectory(this.basePath, true).finally();
    this.createDirectory(this._privatePath).finally();
    this.createDirectory(this._publicPath).finally();
  }

  /**
   * Spojí jednotlivé části cesty pomocí separátoru
   *
   * @param subfolders Podsložky, které mají utvořit výslednou cestu
   * @return Podsložky spojené separátorem
   */
  public mergePath(...subfolders: string[]): string {
    return path.join(...subfolders);
  }

  /**
   * Spojí jednotlivé části cesty pomocí separátoru
   *
   * @param exceptionIfNotFound True, pokud se má vyhodit vyjímka,
   *        když není soubor nalezen
   * @param subfolders Podsložky, které mají utvořit výslednou cestu
   * @return Cestu k veřejně dostupnému souboru
   * @throws FileAccessRestrictedException Pokud bude výsledná cesta
   *         ukazovat mimo bezpečnou zónu (mimo pracovní složku stimulátoru)
   * @throws FileNotFoundException Pokud se na výsledné cestě nenachází
   *         žádný soubor
   */
  public mergePublicPath(exceptionIfNotFound: boolean, ...subfolders: string[]): string {
    const finalPath = path.join(this._publicPath, ...subfolders);
    // Ověřím, že uživatel nepřistupuje mimo veřejnou složku
    if (!this.isPublicPathSecured(finalPath)) {
      // Pokud se snaží podvádět, tak mu to včas zatrhnu
      throw new FileAccessRestrictedException(finalPath);
    }
    // Pokud soubor neexistuje a mám vyhodi vyjímku
    if (!this.existsFile(finalPath) && exceptionIfNotFound) {
      // Tak ji vyhodím
      throw new FileNotFoundException(finalPath);
    }

    return finalPath;
  }

  /**
   * Spojí jednotlivé části cesty pomocí separátoru
   *
   * @param exceptionIfNotFound True, pokud se má vyhodit vyjímka,
   *        když není soubor nalezen
   * @param subfolders Podsložky, které mají utvořit výslednou cestu
   * @return Cestu k privátnímu souboru
   * @throws FileAccessRestrictedException Pokud bude výsledná cesta
   *         ukazovat mimo bezpečnou zónu (mimo pracovní složku stimulátoru)
   * @throws FileNotFoundException Pokud se na výsledné cestě nenachází
   *         žádný soubor
   */
  public mergePrivatePath(exceptionIfNotFound: boolean, ...subfolders: string[]): string {
    const finalPath = path.join(this._privatePath, ...subfolders.filter((value) => value));
    // Ověřím, že uživatel nepřistupuje mimo privátní složku
    if (!this.isPrivatePathSecured(finalPath)) {
      // Pokud se snaží podvádět, tak mu to včas zatrhnu
      throw new FileAccessRestrictedException(finalPath);
    }
    // Pokud soubor neexistuje a mám vyhodi vyjímku
    if (!this.existsFile(finalPath) && exceptionIfNotFound) {
      // Tak ji vyhodím
      throw new FileNotFoundException(finalPath);
    }

    return finalPath;
  }

  /**
   * Ověří, zda-li zadaná cesta opravdu vychází ze složky public
   *
   * @param folderPath Cesta
   * @return True, pokud je cesta validní, jinak false
   */
  public isPublicPathSecured(folderPath: string) {
    return folderPath.normalize().indexOf(this._publicPath) === 0;
  }

  /**
   * Ověří, zda-li zadaná cesta opravdu vychází ze složky private
   *
   * @param folderPath Cesta
   * @return True, pokud je cesta validní, jinak false
   */
  public isPrivatePathSecured(folderPath: string): boolean {
    return folderPath.normalize().indexOf(this._privatePath) === 0;
  }

  /**
   * Metoda rekurzivně projede zadanou cestu a smaže všechno, co jí příjde do cesty
   *
   * @param parentPath string Cesta k souboru/složce
   */
  public recursiveDelete(parentPath: string): void {
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
  public moveFiles(sourceDir: string, destDir: string): void {
    return;
  }

  /**
   * Metoda pro získání obsahu z adresáře
   *
   * @param dir Cesta k adresáři
   * @param location Definice, v jaké složce se soubor nachází (public/private)
   * @return array Pole souborů
   */
  public async getFilesFromDirectory(dir: string, location: FileLocation): Promise<FileRecord[]> {
    this.logger.debug(`Vybírám soubory ze složky: ${dir}.`);
    try {
      // Přečtu obsah složky
      const files: string[] = fs.readdirSync(dir);

      // Pomocí volání funkce 'map' přeměním string[] na FileRecord[]
      return files.map((file: string) => {
        // Získám plnou cestu k souboru
        const fullPath = this.mergePath(dir, file);
        // Získám statistiku o souboru
        const stats = fs.statSync(fullPath);
        // Uložím si, zda-li se jedná o složku
        const isDirectory = stats.isDirectory();
        // Pokud se jedná o soubor, uložím si i jeho příponu
        const extention = isDirectory ? '' : path.extname(fullPath).replace('.', '');
        // Pokud se jedná o obrázek, získám jeho rozměry
        const dimensions = !isDirectory && extention.toLowerCase() === 'png' ? imageSize(fullPath) : null;

        // Následně vyplním požadovanou strukturu
        return {
          name: file,
          path: fullPath.replace(`${location === 'public' ? this._publicPath : this._privatePath}${path.sep}`, '').replace(/\\/g, '/'),
          isDirectory,
          isImage: !isDirectory && extention.toLowerCase() === 'png',
          width: dimensions?.width,
          height: dimensions?.height,
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
   * @return True, pokud se složku podařilo vytvořit, jinak False
   */
  public async createDirectory(dirPath: string, throwException = false): Promise<boolean> {
    // Zkontroluji, zda-li již složka existuje
    if (!this.existsFile(dirPath)) {
      // Složka neexistuje, tak ji půjdu vytvořit
      this.logger.verbose(`Vytvářím složku: ${dirPath}.`);
      try {
        // Vytvářím novou složku
        await fs.promises.mkdir(dirPath);
        // Úspěch, vrátím true
        return true;
      } catch (e) {
        this.logger.error(e);
        // Nastala chyba. Pokud mám vyhodit vyjímku
        if (throwException) {
          // Tak ji i vyhodím
          // throw new Error('Složku se nepodařilo vytvořit!');
          throw new FolderIsUnableToCreateException(dirPath);
        }
      }
    }

    // Nemám vyhazovat vyjímku, tak alespoň vrátím false,
    // jakon indikátor nezdaru
    return false;
  }

  /**
   * Vrátí hash (sha1) souboru
   *
   * @param filePath Cesta k souboru
   * @return false|string false v případě, že se hash nepodařilo vytvořit, nebo hash
   */
  public async hashFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha1');
      const stream = fs.createReadStream(filePath);
      stream.on('error', (err) => reject(err));
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  /**
   * Přečte soubor a vrátí obsah
   *
   * @param filePath Cesta k souboru
   * @return Obsah souboru
   * @throws FileNotFoundException Pokud soubor neexistuje
   */
  public readFileStream(filePath: string): fs.ReadStream {
    if (!this.existsFile(filePath)) {
      throw new FileNotFoundException(filePath);
    }
    return fs.createReadStream(filePath);
  }

  /**
   * Přečte obsah souboru a vrátího v bufferu
   *
   * @param filePath Cesta k souboru
   * @param options Parametry
   * @throws FileNotFoundException Pokud soubor neexistuje
   */
  public readFileBuffer(filePath: string, options: string | { encoding: string; flag?: string }): string | Buffer {
    if (!this.existsFile(filePath)) {
      throw new FileNotFoundException(filePath);
    }
    return fs.readFileSync(filePath, options);
  }

  /**
   * Zapíše jakýkoliv obsah do souboru
   *
   * @param filePath Cesta k souboru
   * @param content Textový obsah, který se má zapsat do souboru
   */
  public writeFileContent(filePath: string, content: unknown): Promise<void> {
    this.logger.verbose('Zapisuji do souboru obsah.');
    return new Promise<void>((resolve) => {
      const stream = fs.createWriteStream(filePath, { flags: 'w' });
      stream.write(content, (error: Error) => {
        if (!error) {
          resolve();
        } else {
          throw new ContentWasNotWrittenException(filePath, content);
        }
      });
      stream.end();
    });
  }

  /**
   * Odstraní soubor v parametru
   *
   * @param filePath Cesta k souboru, který se má odstranit
   * @throws FileManipulationException
   */
  public async deleteFile(filePath: string): Promise<void> {
    return;
  }

  /**
   * Přejmenuje soubor na nový název
   *
   * @param oldPath Originální cesta k souboru
   * @param newPath Nová cesta k souboru
   */
  public async rename(oldPath: string, newPath: string): Promise<void> {
    return fs.promises.rename(oldPath, newPath);
  }

  /**
   * Zkontroluje, zda-li zadaný soubor existuje
   *
   * @param filePath Cesta k testovanému souboru
   * @return bool True, pokud soubor existuje, jinak false
   */
  public existsFile(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Zjistí, zda-li se na zadané cestě nachází složka, nebo soubor
   *
   * @param filePath Kontrolovaná cesta
   */
  public isDirectory(filePath: string): boolean {
    return fs.statSync(filePath).isDirectory();
  }

  /**
   * Vrátí rodičovskou složku na zadané cestě
   *
   * @param filePath Cesta ke koncové složce/souboru
   */
  public getParentDirectory(filePath: string): string | undefined {
    return path.dirname(filePath).split(path.sep).pop();
  }

  public get privatePath(): string {
    return this._privatePath;
  }

  public get publicPath(): string {
    return this._publicPath;
  }
}
