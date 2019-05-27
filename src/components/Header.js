import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Button from '@material-ui/core/Button';
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

const Header = props => {
	return (
		<Container>
			<BottomNavigationAction 
				label="Recorder" 
				icon={<MicIcon />}
				style={{width: '100%'}}
				component={NavItem}
				to="/"
			/>
			<BottomNavigationAction 
				label="Settings" 
				icon={<SettingsIcon />} 
				style={{width: '100%'}}
				component={NavItem}
				to="/settings"
			/>
		</Container>
	);
}

export default Header;