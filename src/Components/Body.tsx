import { Divider, List, Typography } from '@material-ui/core';
import './Body.scss';
import DropdownSwitch from './DropdownSwitch';
import EnabledSwitch from "./EnableSwitch";
import ExcludedWebSites from './ExcludedWebSites';

export function Body() {

	return (
		<div>
			<Typography variant="h5" id="title">
				Chrome Markdown emojis
			</Typography>
			<Divider />
			<List>
				<EnabledSwitch />
				<DropdownSwitch />
			</List>
			<Divider />
			<ExcludedWebSites />
			<Divider />
			<Typography variant="h4" id="icon">
				🙃
			</Typography>
		</div>

	);
}