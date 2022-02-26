import { Settings } from '../shared/constants';
import { removeDropdown } from './dropdown';
import { globals } from './globals';
import { activate, deactivate } from './init';

chrome.storage.sync.get([Settings.Enabled, Settings.DropdownEnabled], (data) => {
  globals.settings[Settings.Enabled] = data[Settings.Enabled] ?? true;
  activate();
});

chrome.storage.sync.get(Settings.DropdownEnabled, (data) => {
  globals.settings[Settings.DropdownEnabled] = data[Settings.DropdownEnabled] ?? true;
  activate();
});


chrome.storage.sync.get(Settings.ExcludedWebsites, (data) => {
  setExcludedWebsites(data[Settings.ExcludedWebsites] ?? []);
});

chrome.storage.sync.get(Settings.TabToInsert, (data) => {
  globals.settings[Settings.TabToInsert] = !!data[Settings.TabToInsert];
  activate();
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
      globals.settings[Settings.DropdownEnabled] = changes[Settings.DropdownEnabled].newValue;
      if (!changes[Settings.DropdownEnabled]?.newValue) {
        removeDropdown();
      }
    } else if (changes[Settings.TabToInsert]) {
      globals.settings[Settings.TabToInsert] = changes[Settings.TabToInsert].newValue;
    }
    if (changes[Settings.ExcludedWebsites]) {
      setExcludedWebsites(changes[Settings.ExcludedWebsites].newValue);
    }
  }
});

function setExcludedWebsites(urls: string[]): void {
  globals.settings[Settings.ExcludedWebsites] = urls.map((url: string) => new RegExp(`^${url}$`, 'gm'));
  activate();
}
