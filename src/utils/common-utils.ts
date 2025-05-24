/**
 * Converts a camelCase or snake_case string to sentence case
 * @param str The string to convert
 * @returns A sentence-cased string
 */

export const toSentenceCase = (str: string) => {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Converts a comma-separated string to an array of strings
 * @param value The comma-separated string to convert
 * @returns An array of strings, or undefined if the input is empty
 */
export const commaSeparatedToArray = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  return value.split(',').filter(Boolean);
};

/**
 * Converts an array of strings to a comma-separated string
 * @param values The array of strings to convert
 * @returns A comma-separated string, or empty string if the input is empty
 */
export const arrayToCommaSeparated = (values?: string[]): string => {
  return values?.length ? values.join(',') : '';
};
