import {
	OPEN_DIR_SELECT,
	SET_SAVE_PATH,
	CANCEL_SET_SAVE_PATH,
} from 'actions/types';

export const INITIAL_STATE = {
	savePath: window.localStorage.getItem('saveDir') || null,
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
				savePath: action.savePath,
			}

		case CANCEL_SET_SAVE_PATH:
			return {
				...state,
				loading: false,
			}

		default: return state
	}
}

export default settings;
