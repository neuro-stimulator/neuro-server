import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

const rootDir = path.resolve(__dirname, '../');
const serverDir = path.resolve(rootDir, 'apps', 'server');
const outputDir = path.resolve(rootDir, 'dist', 'apps', 'server');
const environmentsDir = path.resolve(serverDir, 'environments');
const overridesDir = path.resolve(environmentsDir, 'overrides');
const envSuffix = '.env';
const envLocalSuffix = '.local';

const keys = {
  '$__DIRNAME__$': process.env.ROOT_DIR || outputDir,
  '$__ASSET_PLAYER_PYTHON_PATH__$': process.env.ASSET_PLAYER_PYTHON_PATH || '',
  '$__ASSET_PLAYER_PATH__$': process.env.ASSET_PLAYER_PATH || ''
};

if (process.env.VERBOSE === 'true') {
  console.log(keys);
}

type ENV = 'dev' | 'qa' | 'production';
type OVERRIDES = 'heroku' | 'rpi';
type ENV_CONTENT = Record<string, string> | undefined

/**
 * Načte proměnné prostředí ze souboru
 *
 * @param envFile Cesta k souboru s proměnnými prostředí
 */
async function loadEnvFile(envFile: string): Promise<ENV_CONTENT> {
  console.log(`Načítám ENV soubor: '${envFile}'.`);
  if (!fs.existsSync(envFile)) {
    console.error(`ENV soubor na cestě: '${envFile}' neexistuje!`);
    return undefined;
  }

  return new Promise(async (resolve, reject) => {
    const result: ENV_CONTENT = {};
    const rl = readline.createInterface({
      input: fs.createReadStream(envFile),
      crlfDelay: Infinity
    });
    rl.on('close', () => {
      resolve(result);
    });
    rl.on('error', (e) => {
      reject(e);
    });

    for await (const line of rl) {
      if (line.length === 0 || line.startsWith('#')) continue;

      const values = line.split('=');
      result[values[0]] = values[1];
    }

  });
}

/**
 * Pokud hodnota odpovídá speciálnímu výrazu, dojde k evaluaci hodnoty.
 *
 * @param value Hodnota
 */
function evaluateValue(value: string): string {
  return keys[value] !== undefined ? keys[value] : value;
}

/**
 * Spojí dohromady základní proměnné prostředí s možností přepisu.
 *
 * @param envContent Proměnné prostředí
 * @param overridesContent Přepsané proměnné prostředí
 */
async function mergeEnvironments(envContent: ENV_CONTENT, overridesContent?: ENV_CONTENT): Promise<ENV_CONTENT> {
  const mergedContent: ENV_CONTENT = {};
  for (const key of Object.keys(envContent)) {
    let value = envContent[key];
    if (overridesContent && overridesContent[key] !== undefined) {
      value = overridesContent[key];
    }

    mergedContent[key] = evaluateValue(value);
  }

  return mergedContent;
}

/**
 * Funkce zapíše obsah proměnných prostředí do souboru.
 *
 * @param envContent Proměnné prostředí
 * @param envFile Výstupní soubor
 */
async function writeEnvFile(envContent: ENV_CONTENT, envFile: string): Promise<void> {
  console.log(`Zapisuji ENV soubor: '${envFile}'.`);
  const fd = fs.openSync(envFile + '.tmp', 'w+');

  for (const key of Object.keys(envContent)) {
    fs.writeSync(fd, `${key}=${envContent[key]}\n`);
  }

  fs.closeSync(fd);

  fs.renameSync(envFile + '.tmp', envFile);
}

/**
 * Funkce sloužící k přípravě proměnných prostředí
 *
 * @env = ['dev', 'qa', 'prod']
 * @overrides = ['heroku', 'rpi']
 */
async function prepareConfiguration(env: ENV = 'production', overrides: OVERRIDES = 'rpi'): Promise<void>{
  console.log(`Cesta k environments: ${environmentsDir}`);
  console.log(`Environment: '${env}', overrides: '${overrides}'.`);

  const envFile = path.resolve(environmentsDir, `${env}${envSuffix}`);
  const overridesFile = overrides ? path.resolve(overridesDir, `${overrides}${envSuffix}`) : undefined;
  const mergedFile = path.resolve(outputDir, `${envSuffix}${envLocalSuffix}`);

  const envContent = await loadEnvFile(envFile);
  if (!envContent) {
    console.error('ENV file se nepodařilo přečíst! Končím.');
    process.exit(1);
  }
  const overridesContent = await loadEnvFile(overridesFile);
  if (!overridesContent) {
    console.log('Žádné overrides nebudou aplikovány.');
  }

  const mergedContent = await mergeEnvironments(envContent, overridesContent);
  await writeEnvFile(mergedContent, mergedFile);
}

prepareConfiguration(
  process.env.NODE_ENV as ENV,
  process.env.OVERRIDES as OVERRIDES)
.catch(reason => console.error(reason));
