import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as actions from 'actions/settings.actions';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {
	Container,
	Section,
	SectionTitle,
	SectionSubTitle,
	SectionBody,
} from 'components/CommonUI';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class Settings extends Component {
	constructor(props) {
		super(props);

		this.formatInputLabel= React.createRef();
	}
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

	handleSetFormat = (e, {props}) => {
		console.log('handleSetFormat, data:', props)
		this.props.setFormat(props.value);
	}

	render() {
		const { saveDir, format } = this.props;

		// console.log('Settings, format:', format)
		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Settings</SectionTitle>
					<SectionSubTitle variant="caption">Storage</SectionSubTitle>
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
				<Section>
					<SectionSubTitle variant="caption">Format</SectionSubTitle>
					<SectionBody>
							<FormControl 
								style={{
										width: '100%',
										height: '38px',
									}}
								variant="outlined" 
								fullWidth
							>
								<InputLabel htmlFor="input-format" ref={this.formatInputLabel}>Select an audio format</InputLabel>
								<Select
									value={format}
									input={<OutlinedInput labelWidth={162} />}
									id="input-format"
									onChange={this.handleSetFormat}
								>
									<MenuItem value="flac">flac</MenuItem>
									<MenuItem value="mp3">mp3</MenuItem>
									<MenuItem value="ogg">ogg</MenuItem>
									<MenuItem value="raw">raw</MenuItem>
								</Select>
							</FormControl>
					</SectionBody>
				</Section>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	console.log('settings state:', state)
	return {
		saveDir: state.settings.saveDir,
		format: state.settings.format
	}
}

export default connect(mapStateToProps, actions)(Settings);