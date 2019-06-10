import { LOAD_RECORDINGS } from 'actions/types';

export const INITIAL_STATE = {
	recordings: [],
}

const storage = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		// case LOAD_RECORDINGS:
		// 	return {
		// 		...state,
		// 		recordings: action.recordings,
		// 	}
		default: return state;
	}
}

export default storage;
