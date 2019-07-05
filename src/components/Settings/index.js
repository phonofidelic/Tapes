import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as actions from 'actions/settings.actions';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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

	handleSetFileFormat = (e, {props}) => {
		this.props.setFormat({
			...this.props.settings.format, 
			file: props.value
		});
	}

	handleSetChannelCount = (e, channelCount) => {
		console.log('handleSetChannelCount, channelCount:', channelCount)
		this.props.setFormat({
			...this.props.settings.format, 
			channels: channelCount
		});
	}

	render() {
		const { settings } = this.props;

		// console.log('Settings, format:', format)
		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Settings</SectionTitle>
					<SectionSubTitle variant="caption">Storage</SectionSubTitle>
					<SectionBody>
						<Tooltip
							title={settings.saveDir || ''}
							placement="top-end"
							enterDelay={300}
						>
							<Typography 
								noWrap
								variant="caption"
								display="block"
							>
								Save folder: {settings.saveDir || '(not set)'}
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
										!settings.saveDir ? 
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
					<SectionBody 
						style={{
							paddingTop: 16
						}}
					>
						<div style={{
							display: 'flex',
						}}>
						<FormControl 
							style={{
									width: '100%',
									height: '38px',
								}}
							variant="outlined" 
							fullWidth
						>
							<InputLabel htmlFor="input-format-file" ref={this.formatInputLabel}>Select an audio format</InputLabel>
							<Select
								value={settings.format.file}
								input={<OutlinedInput labelWidth={162} />}
								id="input-format-file"
								onChange={this.handleSetFileFormat}
							>
								<MenuItem value="flac">flac</MenuItem>
								<MenuItem value="mp3">mp3</MenuItem>
								<MenuItem value="ogg">ogg</MenuItem>
								<MenuItem value="raw">raw</MenuItem>
							</Select>
						</FormControl>
						</div>
						<div style={{
							display: 'flex',
							marginTop: '30px',
						}}>
						<FormControl
							style={{
								width: '100%',
								height: '38px',
							}}
							variant="outlined"
							fullWidth
						>
							<FormLabel htmlFor="input-format-channels">Select channel count</FormLabel>
							<RadioGroup
								style={{
									display: 'inline',
								}}
								value={String(settings.format.channels)}
								id="input-format-channels"
								onChange={this.handleSetChannelCount}
							>
								<FormControlLabel value="1" control={<Radio color="primary" />} label="Mono" />
								<FormControlLabel value="2" control={<Radio color="primary" />} label="Stereo" />
							</RadioGroup>
						</FormControl>
						</div>
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
		format: state.settings.format,
		settings: state.settings,
	}
}

export default connect(mapStateToProps, actions)(Settings);