import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SettingsIcon from '@material-ui/icons/Settings';
import MicIcon from '@material-ui/icons/Mic';
import StorageIcon from '@material-ui/icons/Storage';
import Tooltip from '@material-ui/core/Tooltip';

const Container = styled.div`
	background-color: #e9eae6;
	display: flex;
	width: 100%;
	// max-width: 300px;
	z-index: 4;
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
	let params = new URLSearchParams(window.location.search);
	const view = params.get('view');

	return (
		view === 'workspace' ?
		<Container
			value={locationPathname}
			style={{
				backgroundColor: '#e9eae6',
				WebkitAppRegion: 'drag',
				height: 56,
				zIndex: 4,
			}}
		>
		</Container>
		:
		<NavContainer 
			value={locationPathname}
			style={{backgroundColor: '#e9eae6'}}
		>	
			<BottomNavigationAction
				style={{width: '100%'}}
				label="Recorder" 
				icon={<MicIcon />}
				component={NavItem}
				to="/"
				value="/"
			/>

			{ props.isRecording ?
				<Tooltip title="Disabled while recording">
					<BottomNavigationAction
						style={{
							width: '100%',
							color: '#d3d3d3',
							cursor: 'not-allowed',
						}}
						label="Storage" 
						icon={<StorageIcon />}
					/>
				</Tooltip>
				:
				<BottomNavigationAction
					style={{
						width: '100%',
						color: props.isRecording ? '#d3d3d3' : null
					}}
					label="Storage" 
					icon={<StorageIcon />} 
					component={NavItem}
					to="/storage"
					value="/storage"
				/>
			}

			{ props.isRecording ?
				<Tooltip title="Disabled while recording">
					<BottomNavigationAction
						style={{
							width: '100%',
							color: '#d3d3d3',
							cursor: 'not-allowed',
						}}
						label="Storage"
						icon={<SettingsIcon />} 
					/>
				</Tooltip>
				:
				<BottomNavigationAction
					style={{
						width: '100%'
					}}
					label="Settings" 
					icon={<SettingsIcon />} 
					component={NavItem}
					to="/settings"
					value="/settings"
				/>
			}
		}
		</NavContainer>
	);
}

const mapStateToProps = state => {
	return {
		locationPathname: state.router.location.pathname,
		isRecording: state.recorder.isRecording,
	}
}

export default connect(mapStateToProps, null)(Navigation);
