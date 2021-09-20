import { ListItem, ListItemSecondaryAction, ListItemText, Switch, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug, isOptions } from "../globals";
import { Settings } from "../shared/constants";

/**
 * Switch to disable/enable the extension
 * @returns 
 */
export default function TabToInsertSwitch() {
	const [enabled, setEnabled] = useState<boolean>(false);

	useEffect(() => {
		if (!isDebug) {
			chrome.storage.sync.get(Settings.TabToInsert, (data) => {
				setEnabled(!!data[Settings.TabToInsert]);
			});
		}
	});

	return <ListItem>
		<div>

			<ListItemText
				primary="Tab to insert"
				secondary={isOptions ? null : "Press Tab to insert an emoji"}
			/>
			{isOptions ?
				<Typography paragraph={true} color="textSecondary">
					It enabled, press on {"<Tab>"} will insert the emoji in the input text.<br />
					If not, press on {"<Tab>"} will change the preselected emojis in the dropdown.
				</Typography> : null
			}
		</div>
		<ListItemSecondaryAction>
			<Switch
				checked={enabled ?? true}
				name="switchEnabled"
				onChange={(event) => {
					if (enabled === null && !isDebug) {
						// It was not loaded
						return;
					}
					if (!isDebug) {
						chrome.storage.sync.set({ [Settings.TabToInsert]: event.target.checked });
					}
					setEnabled(event.target.checked);
				}}
			/>
		</ListItemSecondaryAction>
	</ListItem>;
}