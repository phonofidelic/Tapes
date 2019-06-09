import React, { Component } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import * as actions from 'actions/recorder.actions';

import Typography from '@material-ui/core/Typography';

import AudioAnalyser from 'components/AudioAnalyser';
import Visualizer from 'components/Visualizer';
import Monitor from 'components/Monitor';
import RecordingsList from 'components/RecordingsList';
import RecorderControls from 'components/RecorderControls';
import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

// import Wad from 'web-audio-daw';
// // Wad.logs.verbosity = 2

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

// const Datauri = window.require('datauri');
// const datauri = new Datauri();

class Recorder extends Component {
	constructor(props) {
		super(props)
		console.log('### Recorder constructor')

		
	}

	componentDidMount() {
		ipcRenderer.on('rec:tmpFile', (e, tmpFile) => {
			this.handleTmpFile(tmpFile);
		})
	}


	handleStartRec = () => {
		const { saveDir } = this.props;
    console.log('start', this.props.recorder.isRecording)
    this.props.startRec(saveDir);
  }

  handleTmpFile = (tmpFile) => {
  	this.props.setTmpFile(tmpFile)
  }

  handleStopRec = () => {
  	const { saveDir, tmpFile } = this.props;
    console.log('stop', this.props.recorder.isRecording)
    this.props.stopRec(saveDir, tmpFile);
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
				</Section>
				{/*recorder.monitorInstance && <Visualizer mediaStreamSource={recorder.monitorInstance.mediaStreamSource} />*/}
				{recorder.monitorInstance && <AudioAnalyser audio={recorder.monitorInstance} />}
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
		tmpFile: state.recorder.tmpFile,
	}
}

export default connect(mapStateToProps, actions)(Recorder);