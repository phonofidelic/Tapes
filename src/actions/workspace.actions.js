import {
	LOAD_RECORDING,
	ERROR_LOAD_RECORDING,
} from 'actions/types';
import db from 'db';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export const loadRecordingData = id => {
	return dispatch => {
		db.recordings.get(id)
		.then(recording => {
			console.log('LOAD_RECORDING, recording:', recording)

			ipcRenderer.send('wrk:requestAudioBuffer', recording.src)

			dispatch({
				type: LOAD_RECORDING,
				recording
			})
		})
		.catch(err => {
			console.error('ERROR_LOAD_RECORDING')
			dispatch({
				type: ERROR_LOAD_RECORDING
			})
		})
		
	}
}

export const loadAudioBuffer = audioBuffer => {
	return dispatch => {
		dispatch({
			type: 'load_audio_buffer',
			audioBuffer
		})
	}
}