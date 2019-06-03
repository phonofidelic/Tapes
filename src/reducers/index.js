import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { history } from 'config';
import settings, { INITIAL_STATE as settingsInitState } from './settings.reducer';
import recorder, { INITIAL_STATE as recorderInitState } from './recorder.reducer';

export const initGlobalState = {
	settings: settingsInitState,
	recorder: recorderInitState,
}

export default combineReducers({
	settings,
	recorder,
	router: connectRouter(history),
})