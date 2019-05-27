import {
	START_REC,
	STOP_REC,
} from 'actions/types';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export const startRec = () => {
	ipcRenderer.send('start_rec');
	console.log('startRec')
	return dispatch => {
		dispatch({
			type: START_REC
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