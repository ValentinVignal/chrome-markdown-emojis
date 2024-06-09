import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";

interface IExcludeWebsiteProps {
  url: string;
}

/**
 * One excluded website
 * @param props 
 * @returns 
 */
export default function ExcludedWebsite(props: IExcludeWebsiteProps) {

  function onDelete(): void {
    if (!isDebug) {
      chrome.storage.sync.get(Settings.ExcludedWebsites, (data) => {
        const list = (data?.[Settings.ExcludedWebsites] ?? []).filter((url: string) => url !== props.url);
        chrome.storage.sync.set({ [Settings.ExcludedWebsites]: list });
      });
    }
  }

  return <ListItem dense={true}>
    <ListItemText
      primary={props.url}
    />
    <ListItemSecondaryAction>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={onDelete}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>;
}

