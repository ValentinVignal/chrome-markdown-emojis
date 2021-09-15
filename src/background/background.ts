import { Message, MessageTypes, ParseFullEmojiResponse, PartialEmojiResponse } from "../types";


const emojisMapUrl = 'https://raw.githubusercontent.com/markdown-it/markdown-it-emoji/master/lib/data/full.json';

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
		emojisMap = await response.json();
	} catch (error) {
		console.log('Could not download emoji map from', emojisMapUrl, error);
	}
}

fetchEmojisMap();

chrome.runtime.onMessage.addListener(onMessage);

function onMessage(request: Message, sender: any, sendResponse: (response: any) => void) {
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
			sendResponse({
				key,
				emojis: Object.fromEntries(Object.entries(emojisMap).filter(([fullKey]) => fullKey.startsWith(key)).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))),
			} as PartialEmojiResponse)
			break;
	}
}

export { };
