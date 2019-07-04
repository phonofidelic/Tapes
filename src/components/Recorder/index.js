import React, { Component } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import * as actions from 'actions/recorder.actions';

import Typography from '@material-ui/core/Typography';

import AudioAnalyser from 'components/AudioAnalyser';
import Monitor from 'components/Monitor';
import RecorderControls from 'components/Recorder/RecorderControls';
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
	constructor(props) {
		super(props);

		this.state = {
			seconds: 0,
			minutes: 0,
			hours: 0,
		}
	}

	componentDidMount() {
		ipcRenderer.on('rec:set_rec_file', this.handleSetRecFile)
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('rec:set_rec_file', this.handleSetRecFile)
		this.stopTimer()
	}

	startTimer = () => {
		this.secondInterval = setInterval(() => this.setState({
			seconds: this.state.seconds + 1
		}), 1000);

		this.minuteInterval = setInterval(() => this.setState({
			minutes: this.state.minutes + 1
		}), 1000 * 60);

		this.hourInterval = setInterval(() => this.setState({
			hours: this.state.hours + 1
		}), 1000 * 3600);
	}

	stopTimer = () => {
		if (this.secondInterval) clearInterval(this.secondInterval);
		if (this.minuteInterval) clearInterval(this.minuteInterval);
		if (this.hourInterval) clearInterval(this.hourInterval);
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
    this.stopTimer();
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
		console.log('seconds:', this.state.seconds)
		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Recorder</SectionTitle>
					{ recorder.isRecording && <RecordingIndicator /> }
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