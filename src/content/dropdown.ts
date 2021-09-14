
import { dropdownEmojiSpanClassName, dropDownHeight, dropdownId, dropdownKeySpanClassName, dropdownOptionClassName, globals, padding } from './globals';
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
	for (let key in globals.emojis) {
		const option = document.createElement('li');
		// Span Emoji
		const spanEmoji = document.createElement('span');
		const emoji = globals.emojis[key];
		spanEmoji.innerText = emoji;
		spanEmoji.className = dropdownEmojiSpanClassName;
		option.appendChild(spanEmoji);
		// Span key
		const spanKey = document.createElement('span');
		spanKey.innerText = key;
		spanKey.className = dropdownKeySpanClassName;
		option.appendChild(spanKey);

		option.className = dropdownOptionClassName;
		const _text = globals.text;
		const _target = globals.target;
		option.onclick = () => {
			const splits = _text.split(':');
			replaceEmoji(`:${splits[splits.length - 1]}`, `${emoji} `);
			removeDropdown();
			_target?.focus();
		}
		globals.dropDown.appendChild(option);
	}
}

/**
 * Remove the dropdown
 */
export function removeDropdown(): void {
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


