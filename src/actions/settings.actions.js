import {
	OPEN_DIR_SELECT, 
	SET_SAVE_PATH,
	CANCEL_SET_SAVE_PATH,
} from 'actions/types';

export const openDirSelect = () => {
	return (dispatch) => {
		const { ipcRenderer } = window.require('electron');
		ipcRenderer.send('settings:open_dir_select');
		dispatch({
			type: OPEN_DIR_SELECT,
		});
	}
}

export const setSavePath = (path) => {
	return (dispatch) => {
		dispatch({
			type: SET_SAVE_PATH,
			saveDir: path,
		});
	}
}

export const cancelSetSavePath = () => {
	return dispatch => {
		dispatch({
			type: CANCEL_SET_SAVE_PATH,
		})
	}
}

export const setFormat = format => {
	console.log('setFormat, format:', format)
	return dispatch => {
		dispatch({
			type: 'set_format',
			format: format,
		})
	}
}