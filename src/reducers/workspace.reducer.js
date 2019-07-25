import {
	LOAD_RECORDING,
	PLAY_WORKSPACE,
	PAUSE_WORKSPACE,
} from 'actions/types';

export const INITIAL_STATE = {
	recording: null,
	audioBuffer: null,
	loading: false,
	playing: false,
	time: 0,
}

const workspace = ( state = INITIAL_STATE, action) => {
	switch (action.type) {
		case LOAD_RECORDING:
			return {
				...state,
				recording: action.recording,
			}

		case PLAY_WORKSPACE:
			return {
				...state,
				playing: true
			}

		case PAUSE_WORKSPACE:
			return {
				...state,
				playing: false
			}

		case 'stop_workspace':
			return {
				...state,
				playing: false
			}

		case 'set_workspace_time':
			return {
				...state,
				time: action.time
			}

		default: return state;
	}
}

export default workspace;