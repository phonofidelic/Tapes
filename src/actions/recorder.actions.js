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

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const uuidv4 = require('uuid/v4');

export const startRecording = (settings) => {
	if (!settings.saveDir) {
		window.alert('Please select a save directory in Settings.') // TODO: replace with custom error message
		return dispatch => {
			dispatch({
				type: ERROR_NO_SAVE_DIR
			});
		}
	}

	ipcRenderer.send('rec:start', settings);
	return dispatch => {
		// const recording = {
		// 	_id: Math.trunc(Date.now() * Math.random()),
		// 	created: Date.now(),
		// 	// src: path
		// }
		dispatch({
			type: START_REC,
		});
	}
}

export const setRecFile = (recordingFile) => {
	return dispatch => {
		dispatch({
			type: SET_REC_FILE,
			recordingFile: recordingFile
		});
	}
}

export const stopRecording = (settings, recordingFile) => {
	console.log('stopRec, recordingFile:', recordingFile)
	ipcRenderer.send('rec:stop');
	const newRecording = {
		id: uuidv4(),
		title: `${moment().format('MMM Do YYYY, hh:mm:ss a')}`,
		src: `${settings.saveDir}/${recordingFile}`,
		filename: recordingFile,
		format: settings.format,
		created: Date.now(),
		updated: Date.now(),
	}

	return dispatch => {
		dispatch({
			type: STOP_REC,
		})

		db.table('recordings')
		.add(newRecording)
		.then(id => {
			dispatch({
				type: ADD_NEW_REC,
				newRecording
			})
		})
		.catch(err => {
			console.error('Could not save new recording:', err)
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

