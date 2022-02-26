
import { IconButton, ListItem, ListItemSecondaryAction, TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { useState } from "react";
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";


/**
 * Component to add a website
 * @returns 
 */
export default function AddWebsite() {
  const [text, setText] = useState<string>('');

  function onTextChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setText(event.target.value);
  }

  function onAdd(): void {
    if (!isDebug) {
      chrome.storage.sync.get(Settings.ExcludedWebsites, (data) => {
        const list = data?.[Settings.ExcludedWebsites] ?? [];
        if (!list.includes(text)) {
          list.push(text);
          chrome.storage.sync.set({ [Settings.ExcludedWebsites]: list });
        }
        setText('');
      });
    }
  }

  return <ListItem>
    <TextField
      label="Website RegExp"
      onChange={onTextChange}
      value={text}
    />
    <ListItemSecondaryAction>
      <IconButton
        edge="end"
        aria-label="delete"
        disabled={!text}
        onClick={onAdd}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>;
}

