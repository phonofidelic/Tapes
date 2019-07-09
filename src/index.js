import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Route } from "react-router-dom";

import { ConnectedRouter } from 'connected-react-router';

import { history } from 'config';
import Root from 'Root';

ReactDOM.render(
	<Root>
		<ConnectedRouter history={history}>
			<Route
				component={() => (
					<App />
				)}
			/>
		</ConnectedRouter>
	</Root>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
