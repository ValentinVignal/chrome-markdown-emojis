import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { isDebug } from "../globals";
import { Settings } from "../shared/constants";

interface IExcludeWebsiteProps {
	url: string;
}

export default function ExcludedWebSite(props: IExcludeWebsiteProps) {

	function onDelete(): void {
		if (!isDebug) {
			chrome.storage.sync.get(Settings.ExcludedWebsites, (data) => {
				const list = (data?.[Settings.ExcludedWebsites] ?? []).filter((url: string) => url !== props.url);
				chrome.storage.sync.set({ [Settings.ExcludedWebsites]: list });
			});
		}
	}

	return <ListItem dense={true}>
		<ListItemText
			primary={props.url}
		/>
		<ListItemSecondaryAction>
			<IconButton
				edge="end"
				aria-label="delete"
				onClick={onDelete}
			>
				<DeleteIcon />
			</IconButton>
		</ListItemSecondaryAction>
	</ListItem>;
}

