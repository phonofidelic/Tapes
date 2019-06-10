import { LOAD_RECORDINGS, ERR_LOAD_RECORDINGS } from 'actions/types';
import db from 'db';

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
			type: ERR_LOAD_RECORDINGS,
		})
	}
}