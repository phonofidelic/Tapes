import {
	START_REC,
	STOP_REC,
} from 'actions/types';

export const INITIAL_STATE = {
	isRecording: false
}

const recorder = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_REC:
			console.log('START_REC')
			return {
				...state,
				isRecording: true,
			}

		case STOP_REC:
			console.log('STOP_REC')
			return {
				...state,
				isRecording: false,
			}

		default: return state
	}
}

export default recorder;