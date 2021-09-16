import { Message, MessageTypes, ParseFullEmojiResponse, PartialEmojiResponse } from "../types";
import { removeDropdown } from "./dropdown";
import { fullEmojiRegExp, globals, partialEmojiRegExp } from "./globals";
import { getCursorPosition, getText } from "./handleText";
import { parseFullEmojiResponseCallback, partialEmojiResponseCallback } from "./responseCallbacks";

/**
 *
 * @description on key up callback
 *
 * @param event
 * @returns
 */
export function onKeyUp(event: KeyboardEvent): void {
	if (event.key === 'Escape') {
		return removeDropdown();
	}
	if (!event.key.match(/^([a-zA-Z0-9]|_|\+| |:|-){1}$/gm)?.length && event.key !== 'Backspace') {
		// It is not an accepted character, don't do anything
		return;
	}


	const _target = event.target;

	if (!_target || !(_target instanceof HTMLElement)) {
		globals.target = null;
		return;
	}
	globals.target = _target;
	globals.text = getText(globals.target);	// The text to work on
	getCursorPosition();
	const slicedText = globals.text.slice(0, globals.cursorPosition!);
	const fullEmojiMatch = slicedText.match(fullEmojiRegExp);
	const partialEmojiMatch = slicedText.match(partialEmojiRegExp);
	const couldBeFullEmoji = !!fullEmojiMatch?.length;
	const couldBePartialEmoji = !!partialEmojiMatch?.length;

	if (!couldBePartialEmoji) removeDropdown();
	if (!couldBeFullEmoji && !couldBePartialEmoji) return; // Nothing to do

	try {
		if (couldBeFullEmoji) {

			// It might be an emoji!
			chrome.runtime.sendMessage<Message, ParseFullEmojiResponse>({
				type: MessageTypes.ParseFullEmoji,
				text: fullEmojiMatch[0].split(':')[1],
			}, (response) => {
				if (!response) return;
				try {
					parseFullEmojiResponseCallback(response);
				} catch (error) {
					console.log('Error receiving the message', response, error);
				}
			});
		} else if (couldBePartialEmoji && globals.settings.dropdownEnabled) {
			chrome.runtime.sendMessage<Message, PartialEmojiResponse>({
				type: MessageTypes.PartialEmoji,
				text: partialEmojiMatch[0].split(':')[1],
			}, (response) => {
				try {
					partialEmojiResponseCallback(response);
				} catch (error) {
					console.log('Error receiving the message', response, error);
				}
			})
		}
	} catch (error) {
		removeDropdown();
		console.log('Error listening to keyup', error);
	}
}


