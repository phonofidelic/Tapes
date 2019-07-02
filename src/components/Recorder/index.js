import React, { Component } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import * as actions from 'actions/recorder.actions';

import Typography from '@material-ui/core/Typography';

import AudioAnalyser from 'components/AudioAnalyser';
import Monitor from 'components/Monitor';
import RecorderControls from 'components/RecorderControls';
import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

import RecordingIndicator from 'components/Recorder/RecordingIndicator';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class Recorder extends Component {
	componentDidMount() {
		ipcRenderer.on('rec:set_rec_file', this.handleSetRecFile)
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('rec:set_rec_file', this.handleSetRecFile)
	}

	handleStartRec = () => {
		const { settings } = this.props;
    console.log('start', this.props.recorder.isRecording)
    this.props.startRecording(settings);
  }

  handleSetRecFile = (e, recordingFile) => {
  	this.props.setRecFile(recordingFile);
  }

  handleStopRec = () => {
  	const { settings, recordingFile } = this.props;
    console.log('stop', this.props.recorder.isRecording)
    this.props.stopRecording(settings, recordingFile);
  }

  handleStartMonitor = async () => {
  	const { recorder } = this.props;
  	const monitorInstance = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  	this.props.startMonitor(monitorInstance);
  }

  handleStopMonitor = () => {
  	const { recorder } = this.props;
  	recorder.monitorInstance.getTracks().forEach(track => track.stop());
  	this.props.stopMonitor(recorder.monitorInstance);
  }

	render() {
		const { recorder } = this.props;

		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Recorder</SectionTitle>
					{ recorder.isRecording && <RecordingIndicator />}
				</Section>
				{ recorder.monitorInstance && <AudioAnalyser audio={recorder.monitorInstance} /> }
				<RecorderControls
					isRecording={recorder.isRecording}
					monitoring={recorder.monitoring}
					handleStartRec={this.handleStartRec}        
	        handleStopRec={this.handleStopRec}
	        handleStartMonitor={this.handleStartMonitor}
	        handleStopMonitor={this.handleStopMonitor}
	        handleToggleMonitor={this.handleToggleMonitor}
				/>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	// console.log('recorder state:', state)
	return {
		recorder: state.recorder,
		saveDir: state.settings.saveDir,
		recordingFile: state.recorder.recordingFile,
		settings: state.settings,
	}
}

export default connect(mapStateToProps, actions)(Recorder);