import { Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";

export default function EnabledSwitch() {
	const [enabled, setEnabled] = useState<boolean | null>(null);


	useEffect(() => {
		if (!isDebug) {
			chrome.storage.sync.get(Settings.enabled, (data) => {
				setEnabled(data[Settings.enabled]);
			});
		}
	});


	return <div className='row'>
		<p>Enabled</p>
		<Switch
			checked={enabled ?? true}
			name="switchEnabled"
			onChange={(event) => {
				if (enabled === null && !isDebug) {
					// It was not loaded
					return;
				}
				if (!isDebug) {
					chrome.storage.sync.set({ [Settings.enabled]: event.target.checked });
				}
				setEnabled(event.target.checked);
			}}
		/>
	</div>;
}