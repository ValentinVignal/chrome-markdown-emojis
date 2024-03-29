import { Settings } from "../shared/constants";

export const globals = {
  settings: {
    [Settings.Enabled]: false,
    [Settings.DropdownEnabled]: false,
    [Settings.ExcludedWebsites]: [] as RegExp[],
    [Settings.TabToInsert]: false,
  },
  /**
   * The target of the last key event
   */
  target: null as HTMLElement | null,
  /**
   * The text
   */
  text: '',
  cursorPosition: null as number | null,
  /**
   * The drop down
   */
  dropDown: null as HTMLElement | null,
  emojis: {} as { [key: string]: string },
};

export const dropdownId = 'chromeMarkdownEmojiDropdownId';
export const dropdownOptionClassName = 'chromeMarkdownEmojiDropdownOptionClassName';
export const dropdownEmojiSpanClassName = 'chromeMarkdownEmojiDropdownEmojiSpanClassName';
export const dropdownPreselectedEmojiId = 'chromeMarkdownEmojiPreselectedEmojiId';
export const dropdownKeySpanClassName = 'chromeMarkdownEmojiDropdownKeySpanClassName';

export const fullEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|-)*: $/gm);
export const partialEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|-)*$/gm);

export const dropDownHeight = 150;
export const padding = 8;
