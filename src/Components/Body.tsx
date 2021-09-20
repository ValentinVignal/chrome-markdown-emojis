import { Divider, List, Typography } from '@material-ui/core';
import './Body.scss';
import DropdownSwitch from './DropdownSwitch';
import EnabledSwitch from "./EnableSwitch";
import ExcludedWebsites from './ExcludedWebsites';
import InclusiveSearchSwitch from './InclusiveSearchSwitch';
import TabToInsertSwitch from './TabToInsertSwitch';

/**
 *  Body of the popup
 * @returns 
 */
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
				<TabToInsertSwitch />
				<InclusiveSearchSwitch />
			</List>
			<Divider />
			<ExcludedWebsites />
			<Divider />
			<Typography variant="h4" id="icon">
				🙃
			</Typography>
		</div>
	);
}