import { Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";

export default function EnabledSwitch() {
	const [enabled, setEnabled] = useState<boolean | null>(null);


	useEffect(() => {
		if (!isDebug) {
			chrome.storage.sync.get('enabled', (data) => {
				setEnabled(data.enabled);
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
					chrome.storage.sync.set({ enabled: event.target.checked });
				}
				setEnabled(event.target.checked);
			}}
		/>
	</div>;
}