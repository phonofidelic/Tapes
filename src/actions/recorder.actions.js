import {
	START_REC,
	STOP_REC,
	REC_READY,
	START_MONITOR,
	STOP_MONITOR,
	ERROR_NO_SAVE_DIR,
} from 'actions/types';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export const startRec = (saveDir) => {
	if (!saveDir) {
		window.alert('Please select a save directory in Settings.') // TODO: replace with custom error message
		return dispatch => {
			dispatch({
				type: ERROR_NO_SAVE_DIR
			});
		}
	}

	ipcRenderer.send('rec:start', saveDir);
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

export const stopRec = (saveDir, tmpFile) => {
	ipcRenderer.send('rec:stop', saveDir, tmpFile);

	return dispatch => {
		dispatch({
			type: STOP_REC
		});
	}
}

export const createRecEntry = (path) => {
	const recording = {
		_id: Math.trunc(Date.now() * Math.random()),
		created: Date.now(),
		src: path
	}
	return dispatch => {
		dispatch({
			type: REC_READY,
			recording: recording
		});
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

