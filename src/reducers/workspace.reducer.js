import {
	OPEN_RECORDING,
	LOAD_RECORDING,
} from 'actions/types';

export const INITIAL_STATE = {
	recording: null,
	audioBuffer: null,
	loading: false,
}

const workspace = ( state = INITIAL_STATE, action) => {
	switch (action.type) {
		case LOAD_RECORDING:
			return {
				...state,
				recording: action.recording,
			}

		case 'load_audio_buffer':
			return {
				...state,
				audioBuffer: action.audioBuffer,
			}

		default: return state;
	}
}

export default workspace;