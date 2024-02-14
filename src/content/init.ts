import { Settings } from "../shared/constants";
import { removeDropdown } from "./dropdown";
import { globals } from "./globals";
import { onKeyUp } from "./onKeyUp";

/**
 * Adds the listeners
 */
export function activate(): void {
  deactivate(true);
  const currentUrl = window.location.href;
  const isExcluded = globals.settings[Settings.ExcludedWebsites].some(
    (regExp) => !!currentUrl.match(regExp)?.length
  );
  if (globals.settings.enabled && !isExcluded) {
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResizeWindow);
  }
}

/**
 * Remove the listeners
 */
export function deactivate(shouldNotRemoveDropdown: boolean = false): void {
  document.removeEventListener("keyup", onKeyUp);
  document.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResizeWindow);
  if (!shouldNotRemoveDropdown) {
    removeDropdown();
  }
}

function onScroll(): void {
  removeDropdown();
}

function onResizeWindow(): void {
  removeDropdown();
}
