import React from 'react';
import styled from 'styled-components';

const Settings = props => {
	const { handleOpenDirSelect } = props;
	return (
		<div>
			<h1>Settings</h1>
			<p>Set a destination folder for your recordings.</p>
			<button onClick={() => handleOpenDirSelect()}>Current destination folder</button>
		</div>
	)
}

export default Settings;