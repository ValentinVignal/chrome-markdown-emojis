import { Message, MessageTypes, ParseFullEmojiResponse, PartialEmojiResponse } from '../types';

document.addEventListener('keyup', onKeyUp);

/**
 *
 * @description on key up callback
 *
 * @param event
 * @returns
 */
function onKeyUp(event: KeyboardEvent): void {
  const { target } = event;
  if (!target) return;
  const text = getText(target);	// The text to work on
  const fullEmojiMatch = text.match(fullEmojiRegExp);
  const partialEmojiMatch = text.match(partialEmojiRegExp);
  const couldBeFullEmoji = !!fullEmojiMatch?.length;
  const couldBePartialEmoji = !!partialEmojiMatch?.length;

  if (!couldBeFullEmoji && !couldBePartialEmoji) return; // Nothing to do

  try {
    if (couldBeFullEmoji) {
      // It might be an emoji!
      chrome.runtime.sendMessage<Message, ParseFullEmojiResponse>({
        type: MessageTypes.ParseFullEmoji,
        text: fullEmojiMatch[0].split(':')[1],
      }, (response) => {
        try {
          parseFullEmojiResponseCallback(target, text, response);
        } catch (error) {
          console.log('Error receiving the message', response, error);
        }
      });
    } else if (couldBePartialEmoji) {
      chrome.runtime.sendMessage<Message, PartialEmojiResponse>({
        type: MessageTypes.PartialEmoji,
        text: partialEmojiMatch[0].split(':')[1],
      }, (response) => {
        try {
          partialEmojiResponseCallback(target, text, response);
        } catch (error) {
          console.log('Error receiving the message', response, error);
        }
      })
    }
  } catch (error) {
    console.log('Error listening to keyup', error);
  }
}

const fullEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|\-)*: $/gm);
const partialEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|\-)*$/gm);

function parseFullEmojiResponseCallback(target: EventTarget, text: string, response: ParseFullEmojiResponse) {
  if (response?.key && response.key !== response.emoji) {
    const toReplace = `:${response.key}:`;
    const splits = text.split(toReplace);
    if (!(splits.length >= 2)) return;
    const newValue = [...splits.slice(0, splits.length - 2), splits.slice(splits.length - 2).join(response.emoji)].join(toReplace);
    setText(target, text, newValue);
  }
}

function partialEmojiResponseCallback(target: EventTarget, text: string, response: PartialEmojiResponse) {
  if (response?.key && response.emojis && Object.keys(response.emojis).length) {
    console.log('partial emoji response', response.emojis)
  }
}

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
  } return '';
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
