
import { Settings } from '../shared/constants';
import { dropdownEmojiSpanClassName, dropDownHeight, dropdownId, dropdownKeySpanClassName, dropdownOptionClassName, dropdownPreselectedEmojiId, globals, padding } from './globals';
import { replaceEmoji } from './handleText';

let resetPreselectedEmoji = true;

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
	// globals.target.addEventListener('focusout', onFocusOut);
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
	console.log('selectedIndex', globals.preSelectedEmoji);
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
		if (index === globals.preSelectedEmoji) {
			option.setAttribute('id', dropdownPreselectedEmojiId);
		}

		const text = globals.text;
		const target = globals.target;
		option.onclick = () => {
			onClick({
				target,
				text,
				emoji
			});
		}
		globals.dropDown.appendChild(option);

	}
	document.getElementById(dropdownPreselectedEmojiId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
		if (resetPreselectedEmoji) {
			globals.preSelectedEmoji = 0;
		}
		resetPreselectedEmoji = true;
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
	if (
		!!globals.emojis && (
			['ArrowUp', 'ArrowDown'].includes(event.key) ||
			(!globals.settings[Settings.TabToInsert]
				&& event.key === 'Tab'
			)
		)
	) {
		event.preventDefault();
		const emojisNumber = Object.keys(globals.emojis).length ?? 0;
		if (event.key === 'ArrowDown' || (!event.shiftKey && event.key === 'Tab')) {
			globals.preSelectedEmoji += 1;
		} else {
			globals.preSelectedEmoji -= 1;
			if (globals.preSelectedEmoji < 0) {
				globals.preSelectedEmoji = Math.max(emojisNumber - 1, 0);
			}
		}
		globals.preSelectedEmoji %= emojisNumber;
		resetPreselectedEmoji = false;
		rebuildDropdown();
	} else if (
		event.key === 'Enter' ||
		(event.key === ' ' && event.shiftKey) ||
		(globals.settings[Settings.TabToInsert] && event.key === 'Tab')
	) {
		event.preventDefault();
		onClick({
			target: globals.target!,
			text: globals.text,
			emoji: Object.values(globals.emojis)[globals.preSelectedEmoji]
		});
	}
}

function onClick(input: { target: HTMLElement, text: string, emoji: string }): void {
	const splits = input.text.split(':');
	input.target.focus(); // For Facebook, we need to focus before modifying the text and dispatching the event
	replaceEmoji(`:${splits[splits.length - 1]}`, `${input.emoji} `);
	removeDropdown();
}

function onFocusOut(): void {
	window.setTimeout(removeDropdown, 100);
}