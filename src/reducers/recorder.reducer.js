import {
	START_REC,
	STOP_REC,
	SET_REC_FILE,
	START_MONITOR,
	STOP_MONITOR,
	ERROR_NO_SAVE_DIR,
	ERROR_ADD_NEW_REC,
	ERROR_LOAD_RECORDINGS,
} from 'actions/types';

export const INITIAL_STATE = {
	isRecording: false,
	// recordings: [],
	recordingFile: null,
	monitoring: false,
	monitorInstance: null,
	time: 0,
	error: null,
}

const recorder = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'dismiss_error':
			return {
				...state,
				error: null
			}

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

		case ERROR_LOAD_RECORDINGS:
			return {
				...state,
				error: { message: 'Could not load recording from database.' }
			}

		default: return state
	}
}

export default recorder;