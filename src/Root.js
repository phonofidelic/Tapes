import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import reducer, { initGlobalState } from 'reducers/index';
import { theme } from 'config';
// import { loadState, saveState } from './localStorage';
// import { ThemeProvider } from 'contexts/theme.context';	TODO
import { history } from 'config'
import { routerMiddleware } from 'connected-react-router';
import throttle from 'lodash/throttle';


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
	// console.log('saveState state:', state)
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch (err) {
		console.error('localStorage saveState error:', err);
	}
}
/*********************************************************************************************/

const { recorder } = initGlobalState;
// console.log('initGlobalState:', initGlobalState)

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
		// {
		// 	...persistedState,
		// 	// Set everything not tracked by persistentState to initGlobalState defaults. TODO: refactor this
		// 	// recorder: {
		// 	// 	...persistedState.recorder,
		// 	// 	isRecording: recorder.isRecording,
		// 	// 	monitoring: recorder.monitoring,
		// 	// },
		// },
		enhancer
	);
	// console.log('store:', store.getState())

	store.subscribe(throttle(() => {
		saveState({
			settings: store.getState().settings,
		});
	}, 1000));

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