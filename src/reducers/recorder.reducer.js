import {
	START_REC,
	STOP_REC,
	REC_READY,
	SET_TMP_FILE,
	START_MONITOR,
	STOP_MONITOR,
	ERROR_NO_SAVE_DIR,
} from 'actions/types';

export const INITIAL_STATE = {
	isRecording: false,
	tmpFile: null,
	tmpRecordings: [],
	monitoring: false,
	monitorInstance: null,
	// mediaStreamSource: null,
	error: null,
}

const recorder = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_REC:
			return {
				...state,
				isRecording: true,
				// tmpRecordings: [...state.tmpRecordings, action.recording],
			}

		case SET_TMP_FILE:
			return {
				...state,
				tmpFile: action.tmpFile,
			}

		case STOP_REC:
			return {
				...state,
				isRecording: false,
			}

		case REC_READY:
			return {
				...state,
				tmpRecordings: [...state.tmpRecordings, action.recording],
			}

		case START_MONITOR: {
			return {
				...state,
				monitoring: true,
				monitorInstance: action.monitorInstance,
				// mediaStreamSource: action.mediaStreamSource,
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

		default: return state
	}
}

export default recorder;