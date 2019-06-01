import {
	START_REC,
	STOP_REC,
	REC_READY,
	TOGGLE_MONITOR
} from 'actions/types';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export const startRec = () => {
	
	ipcRenderer.send('start_rec');

	return dispatch => {
		// const recording = {
		// 	_id: Math.trunc(Date.now() * Math.random()),
		// 	created: Date.now(),
		// 	// src: path
		// }
		dispatch({
			type: START_REC,
			// recording: recording
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

export const toggleMonitor = monitor => {
	ipcRenderer.send(!monitor ? 'monitor:start' : 'monitor:stop')

	console.log('toggleMonitor, monitor:', monitor)
	ipcRenderer.send('toggle_monitor', monitor)
	 return dispatch => {
	 	dispatch({
	 		type: TOGGLE_MONITOR
	 	})
	 }
}