import { ListItem, ListItemSecondaryAction, ListItemText, Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";

/**
 * Switch to disabled/enable the drop down
 * @returns 
 */
export default function DropdownSwitch() {
	const [enabled, setEnabled] = useState<boolean | null>(null);

	useEffect(() => {
		if (!isDebug) {
			chrome.storage.sync.get(Settings.DropdownEnabled, (data) => {
				setEnabled(data[Settings.DropdownEnabled]);
			});
		}
	});

	return <ListItem>
		<ListItemText
			primary="Dropdown"
		/>
		<ListItemSecondaryAction>
			<Switch
				checked={enabled ?? true}
				onChange={(event) => {
					if (enabled === null && !isDebug) {
						// It was not loaded
						return;
					}
					if (!isDebug) {
						chrome.storage.sync.set({ [Settings.DropdownEnabled]: event.target.checked });
					}
					setEnabled(event.target.checked);
				}}
			/>
		</ListItemSecondaryAction>
	</ListItem>;
}