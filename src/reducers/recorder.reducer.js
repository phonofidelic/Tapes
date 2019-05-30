import {
	START_REC,
	STOP_REC,
	REC_READY,
	TOGGLE_MONITOR,
} from 'actions/types';

export const INITIAL_STATE = {
	isRecording: false,
	tmpRecordings: [],
	monitor: false
}

const recorder = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_REC:
			console.log('START_REC')
			return {
				...state,
				isRecording: true,
				// tmpRecordings: [...state.tmpRecordings, action.recording],
			}

		case STOP_REC:
			console.log('STOP_REC')
			return {
				...state,
				isRecording: false,
			}

		case REC_READY:
			return {
				...state,
				tmpRecordings: [...state.tmpRecordings, action.recording],
			}

		case TOGGLE_MONITOR: {
			return {
				...state,
				monitor: !state.monitor
			}
		}

		default: return state
	}
}

export default recorder;