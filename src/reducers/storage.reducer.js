import { 
	LOAD_RECORDINGS,	
	ADD_NEW_REC,
	DELETE_RECORDING,
	EDIT_RECORDING,
	EDIT_RECORDING_SUCCESS,
	} from 'actions/types';

export const INITIAL_STATE = {
	recordings: [],
	loading: false,
}

const storage = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'fetch_recordings':
			return {
				...state,
				loading: true,
			}

		case LOAD_RECORDINGS:
			return {
				...state,
				recordings: action.recordings,
				loading: false,
			}

		case ADD_NEW_REC:
			return {
				...state,
				recordings: [...state.recordings, action.recording]
			}

		case EDIT_RECORDING: 
			return {
				...state,
				loading: true,
			}

		case EDIT_RECORDING_SUCCESS:
			return {
				...state,
				loading: false,
				recordings: state.recordings.map(recording => recording.id === action.recording.id ? action.recording : recording)
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
