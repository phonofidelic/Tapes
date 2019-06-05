import React, { Component } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import * as actions from 'actions/recorder.actions';

import Typography from '@material-ui/core/Typography';

import Visualizer from 'components/Visualizer';
import RecordingsList from 'components/RecordingsList';
import RecorderControls from 'components/RecorderControls';
import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

// const Datauri = window.require('datauri');
// const datauri = new Datauri();

class Recorder extends Component {
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

  handleToggleMonitor = monitor => {
  	// console.log('handleToggleMonitor:', monitor)
  	this.props.toggleMonitor(monitor);
  }

	render() {
		const { recorder } = this.props;

		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Recorder</SectionTitle>
				</Section>
				<Visualizer />
				<RecorderControls
					isRecording={recorder.isRecording}
					monitor={recorder.monitor}
					handleStartRec={this.handleStartRec}        
	        handleStopRec={this.handleStopRec}
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