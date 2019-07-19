import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/recorder.actions';

import AudioAnalyser from 'components/AudioAnalyser';
import ErrorMessage from 'components/ErrorMessage';
import RecorderControls from 'components/Recorder/RecorderControls';
import {
	Container,
	Section,
	SectionTitle,
} from 'components/CommonUI';

import RecordingIndicator from 'components/Recorder/RecordingIndicator';

export class Recorder extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		window.addEventListener('rec:get_new_recording', this.handleNewRecording)
	}

	componentWillUnmount() {
		window.removeEventListener('rec:get_new_recording', this.handleNewRecording)
	}

	handleStartRec = () => {
		const { settings } = this.props;
    console.log('start', this.props.recorder.isRecording)
    this.props.startRecording(settings);
  }

  handleNewRecording = (e) => {
  	console.log('handleNewRecording, e', e)
  	this.props.addNewRecording(e.detail)
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

  handleDismissError = () => {
  	this.props.dismissError();
  }

	render() {
		const { 
			recorder,
			dismissError
		} = this.props;

		return (
			<Container>
				<ErrorMessage 
					open={Boolean(recorder.error)} 
					error={recorder.error} 
					dismissError={dismissError}
				/>
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