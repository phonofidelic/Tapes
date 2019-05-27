import React, { Component } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import * as actions from 'actions/recorder.actions';

import RecorderControls from 'components/RecorderControls';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class Recorder extends Component {
	componentDidMount() {
		ipcRenderer.on('rec_ready', (e, path) => this.props.createRecEntry(path))
	}

	handleStartRec = () => {
    console.log('start', this.props.recorder.isRecording)
    this.props.startRec();
  }

  handleStopRec = () => {
    console.log('stop', this.props.recorder.isRecording)
    this.props.stopRec();
  }

	render() {
		const { recorder } = this.props;

		console.log('recorder.isRecording:', recorder.isRecording)
		return (
			<div>
				<RecorderControls
					isRecording={recorder.isRecording}
					handleStartRec={this.handleStartRec}        
	        handleStopRec={this.handleStopRec}
				/>
			</div>
		)
	}
}

const mapStateToProps = state => {
	console.log('recorder state:', state)
	return {
		recorder: state.recorder
	}
}

export default connect(mapStateToProps, actions)(Recorder);