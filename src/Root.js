import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import reducer, { initGlobalState } from 'reducers/index';
// import { theme } from 'config';
import ThemeProvider, { theme } from 'theme.context';
import { history } from 'config'
import { routerMiddleware } from 'connected-react-router';
import throttle from 'lodash/throttle';

import { STORAGE_VERSION } from 'config';
/*** Persist state to localStorage ****
 *	From: https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
 */
export const loadState = () => {
	try {
		const serializedState = localStorage.getItem('state');
		if (serializedState === null) {
			console.log('savedState not found')
			return undefined;
		}
		const savedState = JSON.parse(serializedState);
		if (!savedState.version || savedState.version < STORAGE_VERSION) {
			console.log('savedState is out of date')
			// TODO: Load updated storage object
			return undefined;
		}
		console.log('savedState:', savedState)
		return savedState
	} catch (err) {
		console.error('could not load savedState:', err)
		return undefined;
	}
};

export const saveState = (state) => {
	// console.log('saveState state:', state)
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch (err) {
		console.error('localStorage saveState error:', err);
	}
}
/*********************************************************************************************/

export default ({ children, initialState = initGlobalState }) => {
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	const enhancer = composeEnhancers(
		applyMiddleware(
	    reduxThunk,
	    routerMiddleware(history),
	  )
	);

	const persistedState = loadState() || {};

	const store = createStore(
		reducer,
		persistedState,
		enhancer
	);
	// console.log('store:', store.getState())

	store.subscribe(throttle(() => {
		saveState({
			version: store.getState().version,
			settings: store.getState().settings,
		});
	}, 1000));

	const customTheme = createMuiTheme(theme);

	return (
		<Provider store={store}>
      <ThemeProvider>
    		<MuiThemeProvider theme={customTheme}>
          { children }
    		</MuiThemeProvider>
      </ThemeProvider>
		</Provider>
	);
}