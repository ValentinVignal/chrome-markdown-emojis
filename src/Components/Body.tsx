import { Divider, List, Typography } from '@material-ui/core';
import { isOptions } from '../globals';
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
    <div id="body" style={{ width: isOptions ? "600px" : undefined }}>
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
