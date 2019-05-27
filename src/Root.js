import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import reducer from 'reducers/index';
import { theme } from 'config';
// import { ThemeProvider } from 'contexts/theme.context';	TODO

export default ({ children, initialState = {} }) => {
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	const enhancer = composeEnhancers(
		applyMiddleware(
	    reduxThunk,
	  )
	);

	const store = createStore(
		reducer,
		initialState,
		enhancer
	);

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