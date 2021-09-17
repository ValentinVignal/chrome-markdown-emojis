
import { Settings } from '../shared/constants';
import { dropdownEmojiSpanClassName, dropDownHeight, dropdownId, dropdownKeySpanClassName, dropdownOptionClassName, dropdownPreselectedEmojiId, globals, padding } from './globals';
import { replaceEmoji } from './handleText';


/**
 * Rebuild the dropdown
 * @returns 
 */
export function rebuildDropdown(): void {
	if ((!globals.target || !Object.keys(globals.emojis).length)) {
		return removeDropdown();
	}
	if (globals.dropDown) {
		removeDropdown();
	}
	globals.target.addEventListener('focusout', onFocusOut);
	globals.target.addEventListener('keydown', onKeyDown);
	globals.dropDown = document.createElement('ul');
	globals.dropDown.setAttribute('id', dropdownId);
	const xY = findDropdownTopBottom();
	let style = `left: ${xY.x}px;`;
	if (xY.top !== undefined) {
		style += `top: ${xY.top}px;`;
	} else if (xY.bottom !== undefined) {
		style += `bottom: ${xY.bottom}px;`
	}
	globals.dropDown.setAttribute('style', style)
	document.body.appendChild(globals.dropDown);
	const text = globals.text;
	const target = globals.target;
	const cursorPosition = globals.cursorPosition!;
	for (const [index, key] of Object.keys(globals.emojis).entries()) {
		const option = document.createElement('li');
		// Span Emoji
		const spanEmoji = document.createElement('span');
		const emoji = globals.emojis[key];
		spanEmoji.innerText = emoji;
		spanEmoji.classList.add(dropdownEmojiSpanClassName);
		option.appendChild(spanEmoji);
		// Span key
		const spanKey = document.createElement('span');
		spanKey.innerText = key;
		spanKey.className = dropdownKeySpanClassName;
		option.appendChild(spanKey);

		option.className = dropdownOptionClassName;
		if (index === 0) {
			option.setAttribute('id', dropdownPreselectedEmojiId);
		}

		option.onclick = () => {
			onClick({
				target,
				text,
				emoji,
				cursorPosition,
			});
		}
		globals.dropDown.appendChild(option);

	}
}

/**
 * Remove the dropdown
 */
export function removeDropdown(): void {
	if (globals.target) {
		globals.target.removeEventListener('focusout', onFocusOut);
		globals.target.removeEventListener('keydown', onKeyDown);

	}
	if (!!globals.dropDown) {
		// Remove it
		globals.dropDown.remove();
		globals.dropDown = null;
	}
}

type DropdownPosition = { x: number, top?: number | null, bottom?: number | null };

/**
 * Find where the dropdown should be positioned
 * @returns 
 */
function findDropdownTopBottom(): DropdownPosition {
	const targetRect = globals.target!.getBoundingClientRect();

	if (targetRect.top - dropDownHeight > 0) {
		return { x: targetRect.x, bottom: window.innerHeight - targetRect.y + padding };
	} else {
		return { x: targetRect.x, top: targetRect.bottom + padding };
	}
}


function onKeyDown(event: KeyboardEvent) {
	const currentSelected = document.getElementById(dropdownPreselectedEmojiId);
	if (
		!!globals.emojis && (
			['ArrowUp', 'ArrowDown'].includes(event.key) ||
			(!globals.settings[Settings.TabToInsert]
				&& event.key === 'Tab'
			)
		)
	) {
		currentSelected?.removeAttribute('id');
		event.preventDefault();
		let newSelected: Element | null | undefined;
		if (event.key === 'ArrowDown' || (!event.shiftKey && event.key === 'Tab')) {
			newSelected = currentSelected?.nextElementSibling;
			if (!newSelected) {
				newSelected = currentSelected?.parentElement?.firstElementChild;
			}
		} else {
			newSelected = currentSelected?.previousElementSibling;
			if (!newSelected) {
				newSelected = currentSelected?.parentElement?.lastElementChild;
			}
		}
		newSelected?.setAttribute('id', dropdownPreselectedEmojiId);
		newSelected?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	} else if (
		event.key === 'Enter' ||
		(event.key === ' ' && event.shiftKey) ||
		(globals.settings[Settings.TabToInsert] && event.key === 'Tab')
	) {
		event.preventDefault();
		onClick({
			target: globals.target!,
			text: globals.text,
			emoji: currentSelected?.firstElementChild?.textContent as string,
			cursorPosition: globals.cursorPosition!,
		});
	}
}

function onClick(input: { target: HTMLElement, text: string, emoji: string, cursorPosition: number }): void {
	const slicedText = input.text.slice(0, input.cursorPosition);
	const splits = slicedText.split(':');
	const partialKey = splits[splits.length - 1];
	input.target.focus(); // For Facebook, we need to focus before modifying the text and dispatching the event
	replaceEmoji(`:${partialKey}`, `${input.emoji} `, input.cursorPosition);
	removeDropdown();
}

function onFocusOut(): void {
	window.setTimeout(removeDropdown, 100);
}