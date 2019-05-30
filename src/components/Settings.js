import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as actions from 'actions/settings.actions';

import Button from '@material-ui/core/Button';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	text-align: left;
	padding: 8px;
`

class Settings extends Component {
	componentDidMount() {
		ipcRenderer.on('select_dir', (e, path) => {
			this.props.setSavePath(path);
		});
		ipcRenderer.on('select_dir_cancel', (e, path) => {
			this.props.cancelSetSavePath(path);
		});
	}

	handleOpenDirSelect = () => {
		this.props.openDirSelect()
	}

	render() {
		const { settings } = this.props;

		return (
			<Container>
				<h1>Settings</h1>
				<h2>Save directory:</h2>
				<p>Set a destination folder for your recordings.</p>
					<div>
						<Button 
							fullWidth 
							variant="outlined"
							onClick={() => this.handleOpenDirSelect()}
						>
							{
								!settings.savePath ? 
								'Set destination folder' 
								:
								'Change destination folder'
							}
						</Button>
					</div>
					<p style={{fontSize: '.8em'}}>Current: {settings.savePath || '(not set)'}</p>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	console.log('settings state:', state)
	return {
		settings: state.settings
	}
}

export default connect(mapStateToProps, actions)(Settings);