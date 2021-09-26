/**
 * Credit: https://stackoverflow.com/a/48981669 *
 *
 * @param xs Pole objektů
 * @param f Funkce, která vrátí klíč, dle kterého se má výsledek seskupit
 */
export function groupBy<T>(xs: T[], f: (v: T) => string): Record<string, T[]> {
  // noinspection CommaExpressionJS
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}

/**
 * Označí výsledek experimentu ke smazání po ukončení testu.
 *
 * @param fileName Název souboru s výsledkem experimentu
 */
export function markCreatedExperimentResultData(fileName: string) {
  global.markedExperimentResultData.push(fileName);
}

export function waitFor(millis: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}
