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
 * @description Gets the [HTMLElement] that contains the text.
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
 * @description Handles the false "input" on facebook which are a bit different.
 * Those are not normal `HTMLInputElement` but `div`s.
 *
 * For some time it was working possible to make it work doing a
 * ```js
 * target.dispatchEvent(new InputEvent('input', {bubbles: true}));
 * ```
 * But it stopped working for some reasons.
 * 
 * ---
 * 
 * Now it gets the window's selection, select the text to replace and 
 */
function setFacebookText(toReplace: string, emoji: string): void {
  const selection = window.getSelection()!; // Get the current selection (selection with no length where the cursor is).
  const cursorPosition = selection.focusOffset;

  const focusNode = selection.focusNode!;
  const doc = focusNode.ownerDocument!;

  const range = new Range();    // Range around the text to replace.
  range.setStart(focusNode, cursorPosition - toReplace.length);
  range.setEnd(focusNode, cursorPosition);

  selection.removeAllRanges();  // Remove the ranges from the selection (ex: current cursor position).

  selection.addRange(range); // The created range is added to the selection, so the word to replace is selected.

  // Delete and replace the text selected by inserting the emoji in only one
  // action. This prevents loosing the focus on Facebook when the there is no
  // text anymore in the text input (it shrinks).
  //
  // For some reason, this doesn't work if the inserted text finishes with a
  // space. It is always the case for our emojis insertion. In that case we
  // insert first the emoji without the space and then the space.
  //
  // `execCommand` is deprecated but still useful for inserting text as it is
  // not supported by the the clipboard API:
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
  doc.execCommand('insertText', false, emoji.slice(0, emoji.length - 1));
  doc.execCommand('insertText', false, ' ');

}

/**
 * Replace the emoji in the text field.
 */
export function replaceEmoji(toReplace: string, emoji: string, cursorPosition?: number | null): void {
  if (document.body?.parentElement?.id === 'facebook') {
    return setFacebookText(toReplace, emoji);
  } else {
    cursorPosition ??= globals.cursorPosition;
    const slicedText = globals.text.slice(0, globals.cursorPosition!);
    const newSlicedText = [
      slicedText.slice(0, slicedText.length - toReplace.length),
      emoji,
    ].join('');
    const newValue = [
      newSlicedText,
      globals.text.slice(globals.cursorPosition!),
    ].join('');
    setText(newValue);
    if (globals.target instanceof HTMLInputElement) {
      const newCursorPosition = newSlicedText.length;
      globals.target.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }
}

export function getCursorPosition(): void {
  if (globals.target instanceof HTMLInputElement) {
    globals.cursorPosition = globals.target.selectionStart ?? globals.cursorPosition;
  } else {
    globals.cursorPosition = window.getSelection()?.focusOffset ?? globals.cursorPosition;
  }
}
