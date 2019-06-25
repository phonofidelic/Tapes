import React from 'react';

export const theme = {
	palette: {
		primary: {
			main: '#333333',
			light: '#ffffff',
			dark: '#333333',
			accent: '#fe9154',
		},
		secondary: {
			main: '#d3d3d3',
			light: '#e9eae6',
			dark: '#666666',
		},
	},
	dimensions: {
		workspaceControlsHeight: 68,
	},
}

export const ThemeContext = React.createContext(theme);

export default class ThemeProvider extends React.Component {
	static contextType = ThemeContext;
	render() {
		return <ThemeContext.Provider value={theme}>{this.props.children}</ThemeContext.Provider>
	}
}