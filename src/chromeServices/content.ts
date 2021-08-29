

console.log('content.js loaded');


document.addEventListener("click", function () {
	// Do what you want with click event\
	console.log('click', Date.now());
}, false);


document.addEventListener('keypress', (event: KeyboardEvent) => {
	console.log('key is pressed', (event.target as HTMLInputElement).value, event.key);

});


export { };

// function messagesFromReactAppListener(
// 	msg: DOMMessage,
// 	sender: chrome.runtime.MessageSender,
// 	sendResponse: (response: DOMMessageResponse) => void,
// ): void {
// 	console.log('[content.js]. Message received', msg);

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

// chrome.windows.onFocusChanged.addListener((window) => {
// 	console.log('window', window);
// });


// // var context_id = -1;

// // chrome.input.ime.onFocus.addListener(function (context) {
// // 	context_id = context.contextID;
// // });

// // chrome.input.ime.onKeyEvent.addListener(
// // 	function (engineID, keyData) {
// // 		console.log('engineID', engineID, 'keyData', keyData);
// // 		if (keyData.type === "keydown" && keyData.key.match(/^[a-z]$/)) {
// // 			chrome.input.ime.commitText({
// // 				"contextID": context_id,
// // 				"text": keyData.key.toUpperCase()
// // 			});
// // 			return true;
// // 		} else {
// // 			return false;
// // 		}
// // 	}
// // );