

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
		// TODO: Create a proper type for the request
		if (request.type === 'parseEmoji') {
			if (emojisMap) {
				const key = request.value;
				const emoji = emojisMap[key];
				// TODO: Create a response type
				sendResponse({ key, emoji });
			}
		}
	} catch (error) {
		console.log(error);
	}
});

export { };
