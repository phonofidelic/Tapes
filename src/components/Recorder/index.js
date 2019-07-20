import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as recorderActions from 'actions/recorder.actions';
import * as storageActions from 'actions/storage.actions';
import * as settingsActions from 'actions/settings.actions';

import AudioAnalyser from 'components/AudioAnalyser';
import DialogMessage from 'components/DialogMessage';
import RecorderControls from 'components/Recorder/RecorderControls';
import {
	Container,
	Section,
	SectionTitle,
} from 'components/CommonUI';

import RecordingIndicator from 'components/Recorder/RecordingIndicator';
import EditRecordingForm from 'components/EditRecordingForm';

const actions = {
	...recorderActions,
	...storageActions,
	...settingsActions,
}
export class Recorder extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showRecordingDialog: false
		}
	}

	componentDidMount() {
		window.addEventListener('rec:get_new_recording', this.handleNewRecording)
		window.addEventListener('settings:select_dir', this.handleSelectDir)
	}

	componentWillUnmount() {
		window.removeEventListener('rec:get_new_recording', this.handleNewRecording)
		window.removeEventListener('settings:select_dir', this.handleSelectDir)
	}

	handleStartRec = () => {
		const { settings } = this.props;
    console.log('start', this.props.recorder.isRecording)
    this.props.startRecording(settings);
  }

  handleNewRecording = (e) => {
  	console.log('handleNewRecording, e', e)
  	this.props.addNewRecording(e.detail)
  	this.setState({ showRecordingDialog: true })
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

  handleSelectDir = (e) => {
		this.props.setSavePath(e.detail);
	}

	handleEditSubmit = (formData) => {
		const { recorder } = this.props;
		formData.id = recorder.recording.id;
		this.props.editRecording(formData);
		this.setState({showRecordingDialog: false});
	}

	handleDiscardRecording = (id, path) => {
		this.props.deleteRecording(id, path);
		this.setState({showRecordingDialog: false});
	}

	render() {
		const { 
			recorder,
			saveDir,
			dismissError,
			openDirSelect,
		} = this.props;

		return (
			<Container>
				<DialogMessage 
					open={!saveDir} 
					title="Heads up!"
					message="Please select a save folder."
					actionButtonText="Set save folder"
					cancelButtonText="Cancel"
					handleAction={openDirSelect}
					//handleClose={dismissError}
				/>
				<DialogMessage 
					open={Boolean(recorder.recording) && this.state.showRecordingDialog} 
					title="New recording:"
					message="Hit <Enter> when done, or click Cancel to discard this recording"
					actionButtonText="Submit"
					cancelButtonText="Cancel"
					//handleAction={this.handleEditSubmit}
					handleClose={() => this.handleDiscardRecording(recorder.recording.id, recorder.recording.src)}
				>
					<EditRecordingForm 
						recording={recorder.recording}
						setEditMode={() => this.setState({showRecordingDialog: false})}
						handleEditSubmit={this.handleEditSubmit}
					/>
				</DialogMessage>
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