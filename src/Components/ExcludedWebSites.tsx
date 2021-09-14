import { List, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";
import AddWebsite from "./AddWebsite";
import ExcludedWebSite from "./ExcludedWebSite";

export default function ExcludedWebSites() {
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
		{list.map((url) => <ExcludedWebSite url={url} />)}
		<AddWebsite />
	</List>
}

