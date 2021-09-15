import { ListItem, ListItemSecondaryAction, ListItemText, Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";
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
		<ListItemText
			primary="Tab to insert"
			secondary="Press Tab to insert an emoji"
		/>
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