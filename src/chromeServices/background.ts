import { Message, MessageTypes, ParseFullEmojiResponse } from "../types";


const emojisMapUrl = 'https://raw.githubusercontent.com/markdown-it/markdown-it-emoji/master/lib/data/full.json';

let emojisMap: { [key: string]: string };

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
	switch (request.type) {
		case MessageTypes.ParseFullEmoji:
			if (request.type === MessageTypes.ParseFullEmoji) {
				const key = request.text;
				const emoji = emojisMap[key];
				sendResponse({ key, emoji } as ParseFullEmojiResponse);
			}
			break;
	}

}

export { };
