/**
 * Credit: https://stackoverflow.com/a/48981669 *
 *
 * @param xs Pole objektů
 * @param f Funkce, která vrátí klíč, dle kterého se má výsledek seskupit
 */
export function groupBy<T>(xs: T[], f: (v: T) => string): Record<string, T[]> {
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}
