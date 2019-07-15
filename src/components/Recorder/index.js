import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/recorder.actions';

import AudioAnalyser from 'components/AudioAnalyser';
import RecorderControls from 'components/Recorder/RecorderControls';
import {
	Container,
	Section,
	SectionTitle,
} from 'components/CommonUI';

import RecordingIndicator from 'components/Recorder/RecordingIndicator';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

export class Recorder extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		ipcRenderer.on('rec:get_new_recording', this.handleNewRecording)
	}

	componentWillUnmount() {
		console.log('Recorder unmount')
		ipcRenderer.removeListener('rec:get_new_recording', this.handleNewRecording)
	}

	handleStartRec = () => {
		const { settings } = this.props;
    console.log('start', this.props.recorder.isRecording)
    this.props.startRecording(settings);
  }

  handleNewRecording = (e, newRecording) => {
  	this.props.addNewRecording(newRecording)
  }

  handleStopRec = () => {
    console.log('stop')
    this.props.stopRecording();
  }

  handleStartMonitor = async () => {
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
				<div>
					<SectionTitle variant="overline">Recorder</SectionTitle>
					{ recorder.isRecording && <RecordingIndicator /> }
				</div>
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
	return {
		recorder: state.recorder,
		saveDir: state.settings.saveDir,
		recordingFile: state.recorder.recordingFile,
		settings: state.settings,
	}
}

export default connect(mapStateToProps, actions)(Recorder);