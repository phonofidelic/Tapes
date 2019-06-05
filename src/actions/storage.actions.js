import { FETCH_RECORDINGS } from 'actions/types';

export const loadRecordings = (recordings) => {
	console.log('loadRecordings:', recordings)
	return dispatch => {
		dispatch({
			type: FETCH_RECORDINGS,
			recordings,
		})

	}
}