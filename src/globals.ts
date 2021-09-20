/**
 * Whether or not it is debugging with react the popup
 */
export const isDebug = chrome.storage === undefined;

// eslint-disable-next-line no-restricted-globals
export const isOptions = location.hash === '#options';