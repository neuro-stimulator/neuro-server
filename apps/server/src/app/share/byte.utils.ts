/**
 * Převede číslo na 4 byty
 *
 * @param value Číslo
 */
export function numberTo4Bytes(value: number): number[] {
  const bytes: number[] = [];

  bytes.push((value >> 24) & 0xff); // 1 byte
  bytes.push((value >> 16) & 0xff); // 1 byte
  bytes.push((value >> 8) & 0xff); // 1 byte
  bytes.push((value >> 0) & 0xff); // 1 byte

  return bytes;
}
