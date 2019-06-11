import { 
	LOAD_RECORDINGS,
	ERROR_LOAD_RECORDINGS,
	ADD_NEW_REC,
	DELETE_RECORDING,
	DELETE_RECORDING_SUCCESS,
	DELETE_RECORDING_FAILURE,
	} from 'actions/types';

export const INITIAL_STATE = {
	recordings: [],
}

const storage = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case LOAD_RECORDINGS:
			return {
				...state,
				recordings: action.recordings,
			}

		case ADD_NEW_REC:
			return {
				...state,
				recordings: [...state.recordings, action.newRecording]
			}

		case DELETE_RECORDING:
			return {
				...state,
				recordings: state.recordings.filter(recording => recording.id !== action.id)
			}

		default: return state;
	}
}

export default storage;
