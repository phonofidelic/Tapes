import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as actions from 'actions/settings.actions';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class Settings extends Component {
	componentDidMount() {
		ipcRenderer.on('settings:select_dir', this.handleSelectDir);
		ipcRenderer.on('settings:select_dir_cancel', this.handleSelectDirCancel);
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('settings:select_dir', this.handleSelectDir)
		ipcRenderer.removeListener('settings:select_dir_cancel', this.handleSelectDirCancel)
	}

	handleOpenDirSelect = () => {
		this.props.openDirSelect()
	}

	handleSelectDir = (e, path) => {
		this.props.setSavePath(path);
	}

	handleSelectDirCancel = (e, path) => {
		this.props.cancelSetSavePath(path);
	}

	render() {
		const { saveDir } = this.props;

		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Settings</SectionTitle>
					<SectionBody>
						<Tooltip
							title={saveDir || ''}
							placement="top-end"
							enterDelay={300}
						>
							<Typography 
								noWrap
								variant="caption"
								display="block"
							>
							Save folder: {saveDir || '(not set)'}
							</Typography>
						</Tooltip>
							<Tooltip 
								title="Set a destination folder for your recordings."
								placement="bottom-end"
								enterDelay={300}
							>
								<Button 
									fullWidth 
									variant="outlined"
									onClick={() => this.handleOpenDirSelect()}
								>
									{
										!saveDir ? 
										'Set save folder' 
										:
										'Change save folder'
									}
								</Button>
							</Tooltip>
					</SectionBody>
				</Section>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	console.log('settings state:', state)
	return {
		saveDir: state.settings.saveDir
	}
}

export default connect(mapStateToProps, actions)(Settings);