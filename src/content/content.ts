import { Message, MessageTypes, ParseFullEmojiResponse, PartialEmojiResponse } from '../types';

chrome.storage.sync.get('enabled', (data) => {
  if (data.enabled) {
    activate();
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.enabled?.newValue) {
      activate()
    } else {
      deactivate();
    }
  }
});


function activate(): void {
  document.addEventListener('keyup', onKeyUp);
}

function deactivate(): void {
  document.removeEventListener('keyup', onKeyUp);
  removeDropdown();
}


/**
 * The target of the last key event
 */
let target: HTMLElement | null = null;
/**
 * The text
 */
let text: string = '';

const dropdownId = 'chromeMarkdownEmojiDropdownId';
const dropdownOptionClassName = 'chromeMarkdownEmojiDropdownOptionClassName';

// TODO: Remove or move on scroll
/**
 * The drop down
 */
let dropDown: HTMLElement | null = null;
let emojis: { [key: string]: string } = {};

const fullEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|-)*: $/gm);
const partialEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|-)*$/gm);

/**
 *
 * @description on key up callback
 *
 * @param event
 * @returns
 */
function onKeyUp(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    return removeDropdown();
  }
  if (!event.key.match(/^([a-zA-Z0-9]|_|\+| |:|-){1}$/gm)?.length) {
    // It is not an accepted character, don't do anything
  }


  const _target = event.target;

  if (!_target || !(_target instanceof HTMLElement)) {
    target = null;
    return;
  }
  target = _target;
  text = getText(target);	// The text to work on
  const fullEmojiMatch = text.match(fullEmojiRegExp);
  const partialEmojiMatch = text.match(partialEmojiRegExp);
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
        try {
          parseFullEmojiResponseCallback(response);
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
          partialEmojiResponseCallback(text, response);
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



/**
 * 
 * @param text 
 * @param response 
 * @returns 
 */
function parseFullEmojiResponseCallback(response: ParseFullEmojiResponse): void {
  if (response?.key && response.emoji && response.key !== response.emoji) {
    console.log('full emoji response', response);
    const toReplace = `:${response.key}:`;
    const splits = text.split(toReplace);
    if (!(splits.length >= 2)) return;
    const newValue = [...splits.slice(0, splits.length - 2), splits.slice(splits.length - 2).join(response.emoji)].join(toReplace);
    setText(newValue);
  }
}


/**
 * @description Callback called when the partial emoji response is received
 * @param text 
 * @param response 
 */
function partialEmojiResponseCallback(text: string, response: PartialEmojiResponse): void {
  console.log('partial emoji response', response.emojis, target);
  emojis = response.emojis ?? {};
  rebuildDropdown();
}

const dropDownHeight = 150;
const padding = 8;

type XY = { x: number, top?: number | null, bottom?: number | null };

function findDropdownTopBottom(): XY {
  const targetRect = target!.getBoundingClientRect();

  if (targetRect.top - dropDownHeight > 0) {
    return { x: targetRect.x, bottom: document.body.clientHeight - targetRect.y };
  } else {
    console.log('2');
    return { x: targetRect.x, top: targetRect.bottom + padding };
  }
}

function removeDropdown(): void {
  if (!!dropDown) {
    // Remove it
    dropDown.remove();
    dropDown = null;

  }
}



function rebuildDropdown(): void {
  if ((!target || !Object.keys(emojis).length)) {
    return removeDropdown();
  }

  if (!dropDown) {
    dropDown = document.createElement('ul');
    dropDown.setAttribute('id', dropdownId);
    const xY = findDropdownTopBottom();
    let style = `left: ${xY.x}px;`;
    if (xY.top !== undefined) {
      style += `top: ${xY.top}px;`;
    } else if (xY.bottom !== undefined) {
      style += `bottom: ${xY.bottom}px;`
    }
    // TODO: Use scss file for this
    dropDown.setAttribute('style', style)
    document.body.appendChild(dropDown);
  } else {
    // Remove existing options
    while (dropDown.firstChild) {
      dropDown.removeChild(dropDown.lastChild!);
    }
  }
  for (let key in emojis) {
    const option = document.createElement('li');
    // TODO: add padding and stuff to scss
    option.className = dropdownOptionClassName;
    option.innerText = `${emojis[key]}  ${key}`;
    dropDown.appendChild(option);
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
function setText(newText: string): void {
  if (document.body?.parentElement?.id === 'facebook') {
    return setFacebookText(newText);
  }
  if (target instanceof Element) {
    const targetWithText = getElementWithText(target);
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
    if (element.textContent === text) return getElementWithText(element);
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
  if (target instanceof Element) {
    const targetWithText = getElementWithText(target);
    if (!targetWithText || !(targetWithText instanceof Element)) return;
    if (targetWithText instanceof HTMLElement) {
      targetWithText.innerText = newText;
      target.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
  }
}

export { };
