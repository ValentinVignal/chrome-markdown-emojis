import { List, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug, isOptions } from "../globals";
import { Settings } from "../shared/constants";
import AddWebsite from "./AddWebsite";
import ExcludedWebsite from "./ExcludedWebsite";

/**
 *  All the excluded websites
 * @returns 
 */
export default function ExcludedWebsites() {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!isDebug) {
      chrome.storage.sync.get(Settings.ExcludedWebsites, (data) => {
        setList(data[Settings.ExcludedWebsites] ?? [])
      });
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
          if (changes[Settings.ExcludedWebsites]) {
            setList(changes[Settings.ExcludedWebsites].newValue ?? []);
          }
        }
      });
    }
  });

  return <List dense={true}>
    <Typography variant="h6">
      Excluded websites
    </Typography>
    {isOptions ?
      <Typography paragraph={true} color="textSecondary">
        All the ignored web sites by the extension.<br />
        To disabled the extension on a specific web site or a set of websites, add a <a href="https://regexr.com/">RegExp</a> of their URL(s).
      </Typography>
      : null}
    {list.map((url) => <ExcludedWebsite url={url} />)}
    <AddWebsite />
  </List>
}

