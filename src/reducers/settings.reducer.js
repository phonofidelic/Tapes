import {
	OPEN_DIR_SELECT,
	SET_SAVE_PATH,
	CANCEL_SET_SAVE_PATH,
} from 'actions/types';

export const INITIAL_STATE = {
	saveDir: window.localStorage.getItem('saveDir') || null,
	format: 'mp3',
	loading: false,
}

const settings = (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case OPEN_DIR_SELECT:
			return {
				...state,
				loading: true,
			}

		case SET_SAVE_PATH:
			return {
				...state,
				loading: false,
				saveDir: action.saveDir,
			}

		case CANCEL_SET_SAVE_PATH:
			return {
				...state,
				loading: false,
			}

		case 'set_format':
			return {
				...state,
				format: action.format,
			}

		default: return state
	}
}

export default settings;
