import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { history } from 'config';
import settings, { INITIAL_STATE as settingsInitState } from './settings.reducer';
import recorder, { INITIAL_STATE as recorderInitState } from './recorder.reducer';
import storage, { INITIAL_STATE as storageInitState } from './storage.reducer';
import workspace, { INITIAL_STATE as workspaceInitState } from './workspace.reducer';
import { reducer as formReducer } from 'redux-form';
import { STORAGE_VERSION } from 'config';

export const initGlobalState = {
	settings: settingsInitState,
	recorder: recorderInitState,
	storage: storageInitState,
	workspace: workspaceInitState,
}

export default combineReducers({
	version: () => STORAGE_VERSION,
	settings,
	recorder,
	storage,
	workspace,
	router: connectRouter(history),
	form: formReducer,
})