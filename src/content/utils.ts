/**
 * Slices the @param text to the @param end index safely with emojis.
 * https://stackoverflow.com/questions/54369513/how-to-count-the-correct-length-of-a-string-with-emojis-in-javascript
 */
export const safeSliceText = (text: string, end?: number | null): string => {
  return [...text].slice(0, end ?? undefined).join("");
};

/**
 *
 * Returns the length of the text safely with emojis.
 */
export const safeTextLength = (text: string): number => {
  return [...text].length;
};
