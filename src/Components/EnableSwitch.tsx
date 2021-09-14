import { ListItem, ListItemSecondaryAction, ListItemText, Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";

export default function EnabledSwitch() {
	const [enabled, setEnabled] = useState<boolean | null>(null);

	useEffect(() => {
		if (!isDebug) {
			chrome.storage.sync.get(Settings.Enabled, (data) => {
				setEnabled(data[Settings.Enabled]);
			});
		}
	});

	return <ListItem>
		<ListItemText
			primary="Enabled"
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
						chrome.storage.sync.set({ [Settings.Enabled]: event.target.checked });
					}
					setEnabled(event.target.checked);
				}}
			/>
		</ListItemSecondaryAction>
	</ListItem>;
}