import { globals } from './globals';


/**
 * @description Get the text value from the target
 * @param target The event target
 * @returns
 */
export function getText(target: EventTarget): string {
	if (target instanceof Element) {
		if (target instanceof HTMLElement) {
			if (target instanceof HTMLInputElement) {
				return target.value;
			}
			return target.innerText ?? '';
		}
		return target.textContent ?? '';
	} return '';
}

/**
 * @description Set the text into the target
 * @param target
 * @param text
 */
export function setText(newText: string): void {
	if (document.body?.parentElement?.id === 'facebook') {
		return setFacebookText(newText);
	}
	if (globals.target instanceof Element) {
		const targetWithText = getElementWithText(globals.target);
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
function getElementWithText(target: Element): Element | null {
	if (!target.children.length) return target;

	// It has children
	for (let i = 0; i < target.children.length; i++) {
		const element = target.children[i];
		if (element.textContent === globals.text) return getElementWithText(element);
	}

	return null;
}

/**
 * @description Handles the false "input" on facebook
 *
 * @param newText
 * @returns
 */
function setFacebookText(newText: string): void {
	if (globals.target instanceof Element) {
		const targetWithText = getElementWithText(globals.target);
		if (!targetWithText || !(targetWithText instanceof Element)) return;
		if (targetWithText instanceof HTMLElement) {
			targetWithText.innerText = newText;
			globals.target.dispatchEvent(new InputEvent('input', { bubbles: true }));
		}
	}
}

/**
 * Replace emoji
 * @param toReplace 
 * @param emoji 
 * @returns 
 */
export function replaceEmoji(toReplace: string, emoji: string): void {
	const splits = globals.text.split(toReplace);
	if (!(splits.length >= 2)) return;
	const newValue = [...splits.slice(0, splits.length - 2), splits.slice(splits.length - 2).join(emoji)].join(toReplace);
	setText(newValue);

}

