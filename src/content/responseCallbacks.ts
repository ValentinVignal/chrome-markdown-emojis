import { ParseFullEmojiResponse, PartialEmojiResponse } from "../types";
import { rebuildDropdown } from "./dropdown";
import { globals } from "./globals";
import { replaceEmoji } from "./handleText";

/**
 * 
 * @param text 
 * @param response 
 * @returns 
 */
export function parseFullEmojiResponseCallback(response: ParseFullEmojiResponse): void {
  if (response?.key && response.emoji && response.key !== response.emoji) {
    replaceEmoji(`:${response.key}: `, `${response.emoji} `);
  }
}


/**
 * @description Callback called when the partial emoji response is received
 * @param text 
 * @param response 
 */
export function partialEmojiResponseCallback(response: PartialEmojiResponse): void {
  globals.emojis = response.emojis ?? {};
  rebuildDropdown();
}
