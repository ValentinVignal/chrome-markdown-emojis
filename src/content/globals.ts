
export const globals = {
	settings: {
		enabled: false,
		dropdownEnabled: false,
		excludedWebSites: [] as RegExp[],
	},
	/**
	 * The target of the last key event
	 */
	target: null as HTMLElement | null,
	/**
	 * The text
	 */
	text: '',
	/**
	 * The drop down
	 */
	dropDown: null as HTMLElement | null,
	emojis: {} as { [key: string]: string },
	preSelectedEmoji: 0,
};

export const dropdownId = 'chromeMarkdownEmojiDropdownId';
export const dropdownOptionClassName = 'chromeMarkdownEmojiDropdownOptionClassName';
export const dropdownEmojiSpanClassName = 'chromeMarkdownEmojiDropdownEmojiSpanClassName';
export const dropdownKeySpanClassName = 'chromeMarkdownEmojiDropdownKeySpanClassName';

export const fullEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|-)*: $/gm);
export const partialEmojiRegExp = new RegExp(/( |^):([a-z0-9]|_|\+|-)*$/gm);

export const dropDownHeight = 150;
export const padding = 8;