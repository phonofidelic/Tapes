import {
	OPEN_DIR_SELECT, 
	SET_SAVE_PATH,
	CANCEL_SET_SAVE_PATH,
} from 'actions/types';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

export const openDirSelect = () => {
	ipcRenderer.send('settings:open_dir_select');

	return (dispatch) => {
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