
try {
	console.log('background loaded');
} catch (error) {
	console.log('error', error);
}


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