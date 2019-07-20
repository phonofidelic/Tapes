import {
	START_REC,
	STOP_REC,
	ADD_NEW_REC,
	SET_REC_FILE,
	START_MONITOR,
	STOP_MONITOR,
	ERROR_NO_SAVE_DIR,
	ERROR_ADD_NEW_REC,
} from 'actions/types';

import * as moment from 'moment';
import db from 'db';

const uuidv4 = require('uuid/v4');

export const dismissError = () => {
	return dispatch => {
		dispatch({
			type: 'dismiss_error'
		})
	}
}

export const startRecording = (settings) => {
	if (!settings.saveDir) {
		return dispatch => {
			dispatch({
				type: ERROR_NO_SAVE_DIR
			});
		}
	}

	return dispatch => {
		const { ipcRenderer } = window.require('electron');
		ipcRenderer.send('rec:start', settings);
		dispatch({
			type: START_REC,
		});
	}
}

export const stopRecording = () => {
	console.log('stopRec')

	return dispatch => {
		const { ipcRenderer } = window.require('electron');
		ipcRenderer.send('rec:stop');
		dispatch({
			type: STOP_REC,
		})
	}	
}

export const addNewRecording = (recording) => {
	console.log('addNewRecording, recording:', recording)
	return dispatch => {
		db.table('recordings')
		.add(recording)
		.then(id => {
			return dispatch({
				type: ADD_NEW_REC,
				recording
			})
		})
		.catch(err => {
			console.error('Could not save new recording:', err.message)
			dispatch({
				type: ERROR_ADD_NEW_REC
			})
		})
	}
}

export const startMonitor = (monitorInstance) => {
	console.log('monitorInstance:', monitorInstance)
	return dispatch => {
		dispatch({
			type: START_MONITOR,
			monitorInstance,
		});
	}
}

export const stopMonitor = (monitorInstance) => {
	return dispatch => {
		dispatch({
			type: STOP_MONITOR
		});
	}
}

