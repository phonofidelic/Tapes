import { combineReducers } from 'redux';
import settings, { INITIAL_STATE as settingsInitState } from './settings.reducer';
import recorder, { INITIAL_STATE as recorderInitState } from './recorder.reducer';


export const initGlobalState = {
	settings: settingsInitState,
	recorder: recorderInitState,
}

export default combineReducers({
	settings,
	recorder
})