import { Settings } from "../shared/constants";
import {
  Message,
  MessageTypes,
  ParseFullEmojiResponse,
  PartialEmojiResponse,
} from "../types";

/*
 `background.js` is a unique file loaded by the chrome extension that runs in the background.
 */

const emojisMapUrl =
  "https://raw.githubusercontent.com/markdown-it/markdown-it-emoji/master/lib/data/full.mjs";

let inclusiveSearch = false;

chrome.storage.sync.get(Settings.InclusiveSearch, (data) => {
  inclusiveSearch = !!data[Settings.InclusiveSearch];
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    if (changes[Settings.InclusiveSearch]) {
      inclusiveSearch = changes[Settings.InclusiveSearch].newValue;
    }
  }
});

/**
 * Map of emojis: emoji code => emoji
 */
let emojisMap: { [key: string]: string };

/**
 * Downloads the emoji map
 */
async function fetchEmojisMap(): Promise<void> {
  try {
    const response = await fetch(emojisMapUrl);
    const text = await response.text();
    emojisMap = JSON.parse(text.split("export default ")[1]);
  } catch (error) {
    console.log("Could not download emoji map from", emojisMapUrl, error);
  }
}

fetchEmojisMap();

chrome.runtime.onMessage.addListener(onMessage);

function onMessage(
  request: Message,
  sender: any,
  sendResponse: (response: any) => void
) {
  if (!emojisMap) return;
  let key: string;
  switch (request.type) {
    case MessageTypes.ParseFullEmoji:
      key = request.text;
      const emoji = emojisMap[key];
      sendResponse({ key, emoji } as ParseFullEmojiResponse);
      break;
    case MessageTypes.PartialEmoji:
      key = request.text;
      let entries = Object.entries(emojisMap);
      if (inclusiveSearch) {
        entries = entries.filter(([fullKey]) =>
          inclusiveStartWith(fullKey, key)
        );
        entries.sort(([keyA], [keyB]) => inclusiveSort(keyA, keyB, key));
      } else {
        entries = entries.filter(([fullKey]) => fullKey.startsWith(key));
        entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
      }
      sendResponse({
        key,
        emojis: Object.fromEntries(entries),
      } as PartialEmojiResponse);
      break;
  }
}

/**
 * @description Checks if `otherText` is included in `text`
 * @param text
 * @param otherText
 * @returns
 */
function inclusiveStartWith(text: string, otherText: string): any {
  if (otherText.length > text.length) return false;
  let index = 0;

  for (const letter of otherText) {
    while (index < text.length && letter !== text[index]) {
      index++;
    }
    if (index === text.length || text[index] !== letter) return false;
    index++;
  }
  return true;
}

function inclusiveSort(keyA: string, keyB: string, text: string): number {
  for (const letter of text) {
    const indexA = keyA.indexOf(letter);
    const indexB = keyB.indexOf(letter);
    if (indexA !== indexB) return indexA - indexB;
    keyA = keyA.slice(indexA + 1);
    keyB = keyB.slice(indexB + 1);
  }
  return 0;
}

export {};
