import { 
	LOAD_RECORDINGS,
	ERROR_LOAD_RECORDINGS,
	DELETE_RECORDING,
	DELETE_RECORDING_SUCCESS,
	OPEN_RECORDING,
	EDIT_RECORDING,
	EDIT_RECORDING_SUCCESS,
	ERROR_DELETE_RECORDING,
	ERROR_EDIT_RECORDING,
	} from 'actions/types';
import db from 'db';

const { ipcRenderer } = window.require('electron');

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

export const editRecording = recording => {
	console.log('editRecording, recording:', recording)

	return dispatch => {
		dispatch({
			type: EDIT_RECORDING,
		});

		db.recordings
		.update(recording.id, recording)
		.then(result => {
			console.log(`Updated recording, result:`, result)
			dispatch({
				type: EDIT_RECORDING_SUCCESS,
				recording,
			});
		})
		.catch(err => {
			console.error('Could not update recording:', err)
			dispatch({
				type: ERROR_EDIT_RECORDING
			});
		});
	}
}

export const deleteRecording = (id, path) => {
	console.log('deleteRecording, path:', path)

	return dispatch => {
		const { ipcRenderer } = window.require('electron');
		ipcRenderer.send('storage:delete', path);

		dispatch({
			type: DELETE_RECORDING,
			id,
		})

		db.recordings.where('id').equals(id)
		.delete()
		.then(count => {
			console.log(`Deleted ${count} ${count < 1 ? 'recordings' : 'recording'}.`);
			dispatch({
				type: DELETE_RECORDING_SUCCESS,
			})
		})
		.catch(err => {
			const errCount = err.failures.length;
			console.error(`Could not delete ${errCount} ${errCount < 1 ? 'recordings' : 'recording'}.`)
			dispatch({
				type: ERROR_DELETE_RECORDING,
			})
		})
	}
}

export const openRecording = recording => {
	console.log('openRecording, recording:', recording)

	return dispatch => {
		const { ipcRenderer } = window.require('electron');
		ipcRenderer.send('rec:open', recording);
		
		dispatch({
			type: OPEN_RECORDING,
			recording
		})
	}
}
