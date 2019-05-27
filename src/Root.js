import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import reducer from 'reducers/index';
import { theme } from 'config';
// import { ThemeProvider } from 'contexts/theme.context';	TODO

export default ({ children, initialState = {} }) => {

	const store = createStore(
		reducer,
		initialState,
		applyMiddleware(reduxThunk)
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