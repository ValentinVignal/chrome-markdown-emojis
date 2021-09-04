
document.addEventListener('keyup', (event: KeyboardEvent) => {
	const target = event.target;
	if (!target) return;
	const value = getText(target);	// The text to work on
	console.log('target', target, 'value', value);
	if (!(value.length && value.endsWith(': '))) {
		// It should not be empty and the last value should be 
		return;
	}
	try {
		// TODO: Create a method to check if there might be an emoji
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
			// TODO: Create a method for this
			try {
				if (response?.key && response.key !== response.emoji) {
					const toReplace = `:${response.key}:`;
					const splits = value.split(toReplace);
					if (!(splits.length >= 2)) return;
					const newValue = [...splits.slice(0, splits.length - 2), splits.slice(splits.length - 2).join(response.emoji)].join(toReplace);
					setText(target, value, newValue);
				}
			} catch (error) {
				console.log('error receiving the message', response, error);
			}
		});
	} catch (error) {
		console.log('error listening to keyup', error);
	}
});




/**
 * @description Get the text value from the target
 * @param target The event target
 * @returns 
 */
function getText(target: EventTarget): string {
	if (target instanceof Element) {
		if (target instanceof HTMLElement) {
			if (target instanceof HTMLInputElement) {
				return target.value;
			}
			return target.innerText ?? '';
		}
		return target.textContent ?? '';
	} else
		return '';
}



/**
 * @description Set the text into the target
 * @param target 
 * @param text 
 */
function setText(target: EventTarget, oldText: string, newText: string): void {
	if (document.body?.parentElement?.id === 'facebook') {
		return setFacebookText(target, oldText, newText);
	}
	if (target instanceof Element) {
		const targetWithText = getElementWithText(target, oldText);
		if (!targetWithText || !(targetWithText instanceof Element)) return;
		if (targetWithText instanceof HTMLElement) {
			if (targetWithText instanceof HTMLInputElement) {
				targetWithText.value = newText;
			} else {
				targetWithText.innerText = newText;
			}
		} else {
			targetWithText.textContent = newText;
		}
	}
}

/**
 * @description Get the [HTMLElement] that contains the text
 * 
 * @param target 
 * @param text 
 * @returns 
 */
function getElementWithText(target: Element, text: string): Element | null {
	if (!target.children.length) return target;

	// It has children
	for (let i = 0; i < target.children.length; i++) {
		const element = target.children[i];
		if (element.textContent === text) return getElementWithText(element, text);
	}

	return null;
}

/**
 * @description Handles the false "input" on facebook
 * 
 * @param target 
 * @param oldText 
 * @param newText 
 * @returns 
 */
function setFacebookText(target: EventTarget, oldText: string, newText: string): void {
	if (target instanceof Element) {
		const targetWithText = getElementWithText(target, oldText);
		if (!targetWithText || !(targetWithText instanceof Element)) return;
		if (targetWithText instanceof HTMLElement) {
			targetWithText.innerText = newText;
			target.dispatchEvent(new InputEvent('input', { bubbles: true }));
		}
	}

}

export { };
