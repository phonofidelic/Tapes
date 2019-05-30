import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import reducer from 'reducers/index';
import { theme } from 'config';
// import { loadState, saveState } from './localStorage';
// import { ThemeProvider } from 'contexts/theme.context';	TODO


/*** Persist state to localStorage ****
 *	From: https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
 */
export const loadState = () => {
	try {
		const serializedState = localStorage.getItem('state');
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		return undefined;
	}
};

export const saveState = (state) => {
	console.log('saveState state:', state)
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch (err) {
		console.error('localStorage saveState error:', err);
	}
}
/*********************************************************************************************/

export default ({ children, initialState = {} }) => {
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	const enhancer = composeEnhancers(
		applyMiddleware(
	    reduxThunk,
	  )
	);

	const persistedState = loadState();
	const store = createStore(
		reducer,
		persistedState,
		enhancer
	);
	console.log('store:', store.getState())

	store.subscribe(() => {
		saveState({
			settings: store.getState().settings,
			recorder: { tmpRecordings: store.getState().recorder.tmpRecordings } // Exclude "isRecording" state
		})
	})

	const customTheme = createMuiTheme(theme);

	return (
		<Provider store={store}>
      {/*<ThemeProvider>*/}
    		<MuiThemeProvider theme={customTheme}>
          { children }
    		</MuiThemeProvider>
      {/*</ThemeProvider>*/}
		</Provider>
	);
}