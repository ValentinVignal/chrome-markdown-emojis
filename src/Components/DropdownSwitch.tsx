import { Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";

export default function DropdownSwitch() {
	const [enabled, setEnabled] = useState<boolean | null>(null);


	useEffect(() => {
		if (!isDebug) {
			chrome.storage.sync.get(Settings.dropdownEnabled, (data) => {
				setEnabled(data[Settings.dropdownEnabled]);
			});
		}
	});


	return <div className='row'>
		<p>Dropdown</p>
		<Switch
			checked={enabled ?? true}
			name="switchDropdownEnabled"
			onChange={(event) => {
				if (enabled === null && !isDebug) {
					// It was not loaded
					return;
				}
				if (!isDebug) {
					chrome.storage.sync.set({ [Settings.dropdownEnabled]: event.target.checked });
				}
				setEnabled(event.target.checked);
			}}
		/>
	</div>;
}