import './Body.scss';
import DropdownSwitch from './DropdownSwitch';
import EnabledSwitch from "./EnableSwitch";

export function Body() {

	return (
		<div>
			<h1>Chrome Markdown emojis</h1>
			<EnabledSwitch />
			<DropdownSwitch />
			<h2>🙃</h2>
		</div>

	);
}