import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { history } from 'config';
import settings, { INITIAL_STATE as settingsInitState } from './settings.reducer';
import recorder, { INITIAL_STATE as recorderInitState } from './recorder.reducer';
import storage, { INITIAL_STATE as storageInitState } from './storage.reducer';

export const initGlobalState = {
	settings: settingsInitState,
	recorder: recorderInitState,
	storage: storageInitState,
}

export default combineReducers({
	settings,
	recorder,
	storage,
	router: connectRouter(history),
})