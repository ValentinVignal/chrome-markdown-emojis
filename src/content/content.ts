import { Settings } from '../shared/constants';
import { removeDropdown } from './dropdown';
import { globals } from './globals';
import { activate, deactivate } from './init';

chrome.storage.sync.get([Settings.Enabled, Settings.DropdownEnabled], (data) => {
  globals.settings.enabled = data[Settings.Enabled] ?? true;
  activate();
});

chrome.storage.sync.get(Settings.DropdownEnabled, (data) => {
  globals.settings.dropdownEnabled = data[Settings.DropdownEnabled] ?? true;
  activate();
});

chrome.storage.sync.get(Settings.ExcludedWebsites, (data) => {
  setExcludedWebsites(data[Settings.ExcludedWebsites] ?? []);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes[Settings.Enabled]) {
      if (changes[Settings.Enabled]?.newValue) {
        activate()
      } else {
        deactivate();
      }
    } else if (changes[Settings.DropdownEnabled]) {
      globals.settings.dropdownEnabled = changes[Settings.DropdownEnabled].newValue;
      if (!changes[Settings.DropdownEnabled]?.newValue) {
        removeDropdown();
      }
    }
    if (changes[Settings.ExcludedWebsites]) {
      setExcludedWebsites(changes[Settings.ExcludedWebsites].newValue);
    }
  }
});

function setExcludedWebsites(urls: string[]): void {
  globals.settings.excludedWebSites = urls.map((url: string) => new RegExp(`^${url}$`, 'gm'));
  activate();
}