document.addEventListener('keyup', (event: KeyboardEvent) => {
	try {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		if (!(value.length && value.endsWith(': '))) {
			// It should not be empty and the last value should be 
			return;
		}
		const splits = value.split(' ')
		const lastWord = splits[splits.length - 2];
		if (!(lastWord.startsWith(':') || !lastWord.endsWith(':'))) {
			// It should have the format ":poop:"
			return;
		}
		// It might be an emoji!
		chrome.runtime.sendMessage({
			type: 'parseEmoji',
			value: lastWord.slice(1, lastWord.length - 1),
		}, (response) => {
			try {
				if (response?.key && response.key !== response.emoji) {
					const toReplace = `:${response.key}:`;
					const splits = value.split(toReplace);
					if (!(splits.length >= 2)) return;
					const newValue = [...splits.slice(0, splits.length - 2), splits.slice(splits.length - 2).join(response.emoji)].join(toReplace);
					target.value = newValue;
				}
			} catch (error) {
				console.log('error receiving the message', response, error);
			}
		});
	} catch (error) {
		console.log('error listening to keyup', error);
	}
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