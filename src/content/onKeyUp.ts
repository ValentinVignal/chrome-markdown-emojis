import {
  Message,
  MessageTypes,
  ParseFullEmojiResponse,
  PartialEmojiResponse,
} from "../types";
import { removeDropdown } from "./dropdown";
import { fullEmojiRegExp, globals, partialEmojiRegExp } from "./globals";
import { getCursorPosition, getText } from "./handleText";
import {
  parseFullEmojiResponseCallback,
  partialEmojiResponseCallback,
} from "./responseCallbacks";

/**
 *
 * @description on key up callback
 *
 * @param event
 * @returns
 */
export function onKeyUp(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    return removeDropdown();
  }

  const _target = event.target;
  console.log("target", _target);

  if (!_target || !(_target instanceof HTMLElement)) {
    globals.target = null;
    return;
  }
  globals.target = _target;
  const newText = getText(globals.target); // The text to work on
  console.log("newText", newText);
  if (newText === globals.text) {
    // No change
    return;
  }
  globals.text = newText;
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
      chrome.runtime.sendMessage<Message, ParseFullEmojiResponse>(
        {
          type: MessageTypes.ParseFullEmoji,
          text: fullEmojiMatch[0].split(":")[1],
        },
        (response) => {
          if (!response) return;
          try {
            parseFullEmojiResponseCallback(response);
          } catch (error) {
            console.log("Error receiving the message", response, error);
          }
        }
      );
    } else if (couldBePartialEmoji && globals.settings.dropdownEnabled) {
      console.log("partialEmojiMatch", partialEmojiMatch[0].split(":")[1]);
      chrome.runtime.sendMessage<Message, PartialEmojiResponse>(
        {
          type: MessageTypes.PartialEmoji,
          text: partialEmojiMatch[0].split(":")[1],
        },
        (response) => {
          try {
            partialEmojiResponseCallback(response);
          } catch (error) {
            console.log("Error receiving the message", response, error);
          }
        }
      );
    }
  } catch (error) {
    removeDropdown();
    console.log("Error listening to keyup", error);
  }
}
