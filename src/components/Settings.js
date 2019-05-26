import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	text-align: left;
	padding: 8px;
`

const Settings = props => {
	const {
		settings,
		handleOpenDirSelect
	} = props;
	return (
		<Container>
			<h1>Settings</h1>
			<h2>Save directory:</h2>
			<p>Set a destination folder for your recordings.</p>
				<div>
					<button onClick={() => handleOpenDirSelect()}>
						{
							!settings.savePath ? 
							'Set destination folder' 
							:
							'Change destination folder'
						}
					</button>
				</div>
				<p style={{fontSize: '.8em'}}>Current: {settings.savePath || '(not set)'}</p>
		</Container>
	)
}

export default Settings;