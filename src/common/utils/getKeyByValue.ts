/**
 *
 * @param object
 * @param value
 * @returns string
 */
export function getKeyByValue(object: object, value: string): string {
  return Object.keys(object).find((key) => object[key] === value);
}
