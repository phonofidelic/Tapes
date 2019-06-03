import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as actions from 'actions/settings.actions';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	text-align: left;
`

const Section = styled.div`

`

const SectionTitle = styled.div`
	color: #fff;
	background-color: #333;
	width: 100%;
	padding-left: 8px;
`

const SectionBody = styled.div`
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
				<Section>
					<SectionTitle>
						<Typography variant="overline">Storage</Typography>
					</SectionTitle>
					<SectionBody>
						<Tooltip
							title={settings.savePath || ''}
							placement="top-end"
							enterDelay={300}
						>
							<Typography 
								noWrap
								variant="caption"
								display="block"
							>
							Current: {settings.savePath || '(not set)'}
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
										!settings.savePath ? 
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
		settings: state.settings
	}
}

export default connect(mapStateToProps, actions)(Settings);