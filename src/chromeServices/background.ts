

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	try {
		if (request.type === 'parseEmoji') {
			if (emojisMap) {
				const key = request.value;
				const emoji = emojisMap[key];
				sendResponse({ key, emoji });
			}
		}
	} catch (error) {
		console.log(error);
	}
});

export { };

// import { DOMMessage, DOMMessageResponse } from '../types';

// console.log('background loaded');

// function messagesFromReactAppListener(
// 	msg: DOMMessage,
// 	sender: chrome.runtime.MessageSender,
// 	sendResponse: (response: DOMMessageResponse) => void,
// ): void {
// 	console.log('[content.js]. background Message received', msg);

// 	const response: DOMMessageResponse = {
// 		title: document.title,
// 		headlines: [],
// 	};

// 	// console.log('[content.js]. Message response', response);

// 	// sendResponse(response)
// 	sendResponse(response);
// }

// /**
//  * Fired when a message is sent from either an extension process or a content script.
//  */
// chrome.runtime.onMessage.addListener(messagesFromReactAppListener);