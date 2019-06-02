import React, { Component } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import * as actions from 'actions/recorder.actions';

import Waveform from 'audio-waveform';

import Visualizer from 'components/Visualizer';
import RecordingsList from 'components/RecordingsList';
import RecorderControls from 'components/RecorderControls';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

// const Datauri = window.require('datauri');
// const datauri = new Datauri();

var plotter = new Waveform({
    //what channel to display, 0 - L, 1 - R
    channel: 0,
 
    //size of a sliding window to display, number of samples
    size: 1024,
 
    //offset of a window to display, if undefined - the last piece of data is shown
    offset: undefined,
 
    //how often to update display (node only)
    framesPerSecond: 20,
 
    //line or point draw style
    line: true,
 
    //size of a waveform data to store
    bufferSize: 44100,
 
    //canvas element to render (optional)
    canvas: undefined
 
    //...pcm-format options, see pcm-util below
});

class Recorder extends Component {
	componentDidMount() {
		// ipcRenderer.on('rec_ready', (e, path) => this.props.createRecEntry(path))
		ipcRenderer.on('rec_audio_data', (e, datauri) => {
			// console.log('rec_audio_data:', datauri)
			// this.props.createRecEntry(datauri)
		})
		ipcRenderer.on('rec_writestream_ready', (e, src) => {
			// console.log('rec_writestream_ready, src:', src)
			this.props.createRecEntry(src)
		})

		ipcRenderer.on('monitor:bufferdata', (e, buffer) => {
			console.log('monitor:bufferdata', buffer)
		})
	}

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

		// console.log('recorder.isRecording:', recorder.isRecording)
		// console.log('recorder.monitor:', recorder.monitor)
		return (
			<div>
				{/*<RecordingsList recordings={recorder.tmpRecordings} />*/}
				<Visualizer />
				<RecorderControls
					isRecording={recorder.isRecording}
					monitor={recorder.monitor}
					handleStartRec={this.handleStartRec}        
	        handleStopRec={this.handleStopRec}
	        handleToggleMonitor={this.handleToggleMonitor}
				/>
			</div>
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