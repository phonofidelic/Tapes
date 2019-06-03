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
		// // ipcRenderer.on('rec_ready', (e, path) => this.props.createRecEntry(path))
		// ipcRenderer.on('rec_audio_data', (e, datauri) => {
		// 	// console.log('rec_audio_data:', datauri)
		// 	// this.props.createRecEntry(datauri)
		// });
		// ipcRenderer.on('rec_writestream_ready', (e, src) => {
		// 	// console.log('rec_writestream_ready, src:', src)
		// 	this.props.createRecEntry(src)
		// });	
	}

	// componentWillUnmount() {
	// 	console.log('Recorder unmounted')
	// 	ipcRenderer.removeListener('rec_audio_data')
	// }

	handleStartRec = () => {
    console.log('start', this.props.recorder.isRecording)
    this.props.startRec();
  }

  handleStopRec = () => {
    console.log('stop', this.props.recorder.isRecording)
    this.props.stopRec();
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
					<SectionTitle>
						<Typography variant="overline">Recorder</Typography>
					</SectionTitle>
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
		recorder: state.recorder
	}
}

export default connect(mapStateToProps, actions)(Recorder);