import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SettingsIcon from '@material-ui/icons/Settings';
import MicIcon from '@material-ui/icons/Mic';

const Container = styled(BottomNavigation)`
	display: flex;
	width: 100%;
`

const NavItem = styled(Link)`
	width: 100%;
	// height: 50px;
`

class Navigation extends Component {
	render() {
		const { locationPathname } = this.props;

		return (
			<Container value={locationPathname}>
				<BottomNavigationAction 
					label="Recorder" 
					icon={<MicIcon />}
					style={{width: '100%'}}
					component={NavItem}
					to="/"
					value="/"
				/>
				<BottomNavigationAction 
					label="Settings" 
					icon={<SettingsIcon />} 
					style={{width: '100%'}}
					component={NavItem}
					to="/settings"
					value="/settings"
				/>
			</Container>
		);
	}
}

const mapStateToProps = state => {
	return {
		locationPathname: state.router.location.pathname
	}
}

export default connect(mapStateToProps, null)(Navigation);
