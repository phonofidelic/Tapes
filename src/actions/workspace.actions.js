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