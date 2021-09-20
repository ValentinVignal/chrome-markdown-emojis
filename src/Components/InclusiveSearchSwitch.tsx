import { ListItem, ListItemSecondaryAction, ListItemText, Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";
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
		<ListItemText
			primary="Inclusive search"
		/>
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