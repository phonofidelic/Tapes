import {
	START_REC,
	STOP_REC,
	REC_READY,
	SET_TMP_FILE,
	TOGGLE_MONITOR,
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
			// recording: recording
		});
	}
}

export const setTmpFile = tmpFile => {
	return dispatch => {
		dispatch({
			type: SET_TMP_FILE,
			tmpFile
		})
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

export const toggleMonitor = monitor => {
	ipcRenderer.send(!monitor ? 'monitor:start' : 'monitor:stop')

	console.log('toggleMonitor, monitor:', monitor)
	ipcRenderer.send('toggle_monitor', monitor)
	 return dispatch => {
	 	dispatch({
	 		type: TOGGLE_MONITOR
	 	});
	 }
}