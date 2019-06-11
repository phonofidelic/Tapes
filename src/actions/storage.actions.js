import { 
	LOAD_RECORDINGS,
	ERROR_LOAD_RECORDINGS,
	DELETE_RECORDING,
	DELETE_RECORDING_SUCCESS,
	DELETE_RECORDING_FAILURE,
	} from 'actions/types';
import db from 'db';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export const loadRecordings = (recordings) => {
	return dispatch => {
		db.recordings.reverse().toArray()
		.then(recordings => {
			console.log('loadRecordings:', recordings)
			dispatch({
				type: LOAD_RECORDINGS,
				recordings,
			})
		})
		.catch(err => {
			console.error('Could not load recordings:', err)
		})
		dispatch({
			type: ERROR_LOAD_RECORDINGS,
		})
	}
}

export const deleteRecording = (id, path) => {
	console.log('deleteRecording, path:', path)
	return dispatch => {
		dispatch({
			type: DELETE_RECORDING,
			id
		})

		ipcRenderer.send('storage:delete', path);

		db.recordings.where('id').equals(id)
		.delete()
		.then(count => {
			console.log(`Deleted ${count} ${count < 1 ? 'recordings' : 'recording'}.`);
			dispatch({
				type: DELETE_RECORDING_SUCCESS
			})
		})
		.catch(err => {
			const errCount = err.failures.length;
			console.error(`Could not delete ${errCount} ${errCount < 1 ? 'recordings' : 'recording'}.`)
			dispatch({
				type: DELETE_RECORDING_FAILURE
			})
		})
	}
}
