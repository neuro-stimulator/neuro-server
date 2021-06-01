export type ObjectDiff = Record<string, unknown>;

/**
 * Funkce porovná dva JSON objekty
 *
 * @param lhs Kontrolovaný objekt (nový)
 * @param rhs Kontrolní objekt (původní)
 */
export function jsonObjectDiff<T>(lhs: T, rhs: T): ObjectDiff {
  const diff = {};
  const lhsKeys = Object.keys(lhs);
  const rhsKeys = Object.keys(rhs);
  const keys = new Set([...lhsKeys, ...rhsKeys]);

  for (const key of keys) {
    // klíč se nenachází v kontrolovaném objektu
    if (!Object.prototype.hasOwnProperty.call(lhs, key)) {
      diff[key] = `${rhs[key]} -> `;
      continue;
    }

    // klíč se nenachází v kontrolním objektu
    if (!Object.prototype.hasOwnProperty.call(rhs, key)) {
      diff[key] = ` -> ${lhs[key]}`;
    }

    // klíč je přítomný v obou objektech

    // klíč je stejného typu
    if (typeof(lhs[key]) === typeof(rhs[key])){
      // klíč je objekt
      if (typeof(lhs[key]) === 'object' && lhs[key] !== null && rhs[key] !== null) {
        // rekurzivně si přečtu rozdíly v child objektech
        const childDiff = jsonObjectDiff(lhs[key], rhs[key]);
        // pokud na nějaké rozdíly narazím
        if (Object.keys(childDiff).length != 0) {
          diff[key] = childDiff;
        }
      } else {
        if (lhs[key] !== rhs[key]) {
          diff[key] = `${rhs[key]} -> ${lhs[key]}`;
        }
      }
    }
  }

  return diff;
}
