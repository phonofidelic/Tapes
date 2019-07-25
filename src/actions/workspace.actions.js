import {
	LOAD_RECORDING,
	PLAY_WORKSPACE,
	PAUSE_WORKSPACE,
	ERROR_LOAD_RECORDING,
} from 'actions/types';
import db from 'db';

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

export const playWorkspace = () => {
	return dispatch => {
		dispatch({
			type: PLAY_WORKSPACE
		})
	}
}

export const pauseWorkspace = () => {
	return dispatch => {
		dispatch({
			type: PAUSE_WORKSPACE
		})
	}
}

export const stopWorkspace = () => {
	return dispatch => {
		dispatch({
			type: 'stop_workspace'
		})
	}
}

export const setTime = time => {
	return dispatch => {
		dispatch({
			type: 'set_workspace_time',
			time
		})
	}
}