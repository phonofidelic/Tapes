import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SettingsIcon from '@material-ui/icons/Settings';
import MicIcon from '@material-ui/icons/Mic';
import StorageIcon from '@material-ui/icons/Storage';
import TuneIcon from '@material-ui/icons/Tune';
import { makeStyles } from '@material-ui/core/styles';

const Container = styled.div`
	background-color: #e9eae6;
	display: flex;
	width: 100%;
	// max-width: 300px;
`

const NavContainer = styled(BottomNavigation)`
	background-color: #e9eae6;
	display: flex;
	width: 100%;
	// max-width: 300px;
`

const NavItem = styled(Link)`
	width: 100%;
	// height: 50px;
`

function Navigation(props)  {
	const { locationPathname } = props;

	return (
		locationPathname.includes('/open') ?
		<Container
			value={locationPathname}
			style={{
				backgroundColor: '#e9eae6',
				WebkitAppRegion: 'drag',
				height: 56,
			}}
		>
		</Container>
		:
		<NavContainer 
			value={locationPathname}
			style={{backgroundColor: '#e9eae6'}}
		>
			<BottomNavigationAction
				label="Recorder" 
				icon={<MicIcon />}
				style={{width: '100%'}}
				component={NavItem}
				to="/"
				value="/"
			/>
			<BottomNavigationAction
				label="Storage" 
				icon={<StorageIcon />} 
				style={{width: '100%'}}
				component={NavItem}
				to="/storage"
				value="/storage"
			/>
			<BottomNavigationAction
				label="Settings" 
				icon={<SettingsIcon />} 
				style={{width: '100%'}}
				component={NavItem}
				to="/settings"
				value="/settings"
			/>
		}
		</NavContainer>
	);
}

const mapStateToProps = state => {
	return {
		locationPathname: state.router.location.pathname
	}
}

export default connect(mapStateToProps, null)(Navigation);
