import '../set-environment';
import '../helpers/matchers';

const timeout = 30;

console.log(`Nastavuji timeout testů na: ${timeout}s.`);

jest.setTimeout(timeout * 1000);
