import {
	START_REC,
	STOP_REC,
	REC_READY,
} from 'actions/types';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export const startRec = () => {
	
	ipcRenderer.send('start_rec');

	return dispatch => {
		dispatch({
			type: START_REC,
			
		})
	}
}

export const stopRec = () => {
	ipcRenderer.send('stop_rec');

	return dispatch => {
		dispatch({
			type: STOP_REC
		})
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
		})
	}
}