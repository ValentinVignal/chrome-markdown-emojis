import { ListItem, ListItemSecondaryAction, ListItemText, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { isDebug, isOptions } from "../globals";
import { Settings } from "../shared/constants";

/**
 * Switch to disabled/enable the inclusive search
 * @returns 
 */
export default function InclusiveSearchSwitch() {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!isDebug) {
      chrome.storage.sync.get(Settings.InclusiveSearch, (data) => {
        setEnabled(!!data[Settings.InclusiveSearch]);
      });
    }
  });

  return <ListItem>
    <div>

      <ListItemText
        primary="Inclusive search"
      />
      {isOptions ?
        <Typography paragraph={true} color="textSecondary">
          If disabled, only the emojis starting strictly by the entered text will be displayed in the dropdown.<br />
          Ex: 🎉 (:tada:) will be shown if ':ta' is entered but not if ':td' is entered.<br />
          <br />
          If enabled, all the emojis containing the entered letters in the correct order will be shown.<br />
          Ex: 🎉 (:tada:) will be shown if ':ta' or ':td' is entered, but not if ':dt' is entered.
        </Typography> : null
      }
    </div>
    <ListItemSecondaryAction>
      <Switch
        checked={enabled}
        onChange={(event) => {
          if (enabled === null && !isDebug) {
            // It was not loaded
            return;
          }
          if (!isDebug) {
            chrome.storage.sync.set({ [Settings.InclusiveSearch]: event.target.checked });
          }
          setEnabled(event.target.checked);
        }}
      />
    </ListItemSecondaryAction>
  </ListItem>;
}
