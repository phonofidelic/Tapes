import {
	START_REC,
	STOP_REC,
	ADD_NEW_REC,
	SET_REC_FILE,
	START_MONITOR,
	STOP_MONITOR,
	LOAD_RECORDINGS,
	ERROR_NO_SAVE_DIR,
	ERROR_ADD_NEW_REC,
	ERR_LOAD_RECORDINGS,
} from 'actions/types';

export const INITIAL_STATE = {
	isRecording: false,
	recordings: [],
	recordingFile: null,
	monitoring: false,
	monitorInstance: null,
	error: null,
}

const recorder = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_REC:
			return {
				...state,
				isRecording: true,
				recordingFile: null,
			}

		case SET_REC_FILE:
			return {
				...state,
				recordingFile: action.recordingFile,
			}

		case STOP_REC:
			return {
				...state,
				isRecording: false,
			}

		case ADD_NEW_REC:
			return {
				...state,
				recordings: [...state.recordings, action.newRecording]
			}

		case START_MONITOR: {
			return {
				...state,
				monitoring: true,
				monitorInstance: action.monitorInstance,
			}
		}

		case STOP_MONITOR: {
			return {
				...state,
				monitoring: false,
				monitorInstance: null,
			}
		}

		case LOAD_RECORDINGS: {
			return {
				...state,
				recordings: action.recordings,
			}
		}

		case ERROR_NO_SAVE_DIR:
			return {
				...state,
				error: { message: 'Please select a save directory in Settings.' }
			}

		case ERROR_ADD_NEW_REC:
			return {
				...state,
				error: { message: 'Could not save recording in database.' }
			}

		case ERR_LOAD_RECORDINGS:
			return {
				...state,
				error: { message: 'Could not load recording from database.' }
			}

		default: return state
	}
}

export default recorder;