
import { DOMMessage, DOMMessageResponse } from '../types';

console.log('loaded');

function messagesFromReactAppListener(
	msg: DOMMessage,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response: DOMMessageResponse) => void,
): void {
	console.log('[content.js]. Message received', msg);

	// const response: DOMMessageResponse = {
	// 	title: document.title,
	// 	headlines: Array.from(document.getElementsByTagName<"h1">("h1")).map(h1 => h1.innerText)
	// };

	// console.log('[content.js]. Message response', response);

	// sendResponse(response)
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);


// var context_id = -1;

// chrome.input.ime.onFocus.addListener(function (context) {
// 	context_id = context.contextID;
// });

// chrome.input.ime.onKeyEvent.addListener(
// 	function (engineID, keyData) {
// 		console.log('engineID', engineID, 'keyData', keyData);
// 		if (keyData.type === "keydown" && keyData.key.match(/^[a-z]$/)) {
// 			chrome.input.ime.commitText({
// 				"contextID": context_id,
// 				"text": keyData.key.toUpperCase()
// 			});
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	}
// );