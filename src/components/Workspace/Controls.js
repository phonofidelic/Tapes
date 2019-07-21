import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'theme.context';
import { TEST_ID } from 'constants/testIds';

import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import FormattedTime from 'components/FormattedTime';

const ControlsContainer = styled.div`
	// border: 1px solid red;
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	// justify-content: center;
	padding: 10px;
`

const TimeInfo = styled.div`
	// border: 1px solid red;
	display: flex;
	width: 100px;
	padding-top: 15px;
	padding-left: 10px;
	flex-grow: 1;
	// text-align: justify;
`

function Controls(props) {
	const { 
		playing,
		time,
		duration,
		zoomedIn,
		handleTogglePlay,
		handleToggleZoom,
	} = props;

	const theme = useContext(ThemeContext)
	// console.log('*** theme:', theme)
	return (
		<ControlsContainer data-testid={TEST_ID.WORKSPACE.CONTROLS.CONTAINER}>
			<TimeInfo theme={theme}>
				<div style={{marginRight: 5}}>
					<FormattedTime time={time * 1000} />
				</div>
			</TimeInfo>

			<div 
				style={{
					// flexGrow: 1, 
					// textAlign: 'center'
					marginRight: 50
				}}
			>
				<IconButton onClick={() => handleTogglePlay()}>
				{!playing ? <PlayIcon /> : <PauseIcon />}
				</IconButton>
			</div>

			<div>
				<IconButton onClick={() => handleToggleZoom()}>
					{ !zoomedIn ? <ZoomInIcon /> : <ZoomOutIcon /> }
				</IconButton>
			</div>

			<div style={{
				// border: '1px solid red',
				display: 'flex',
				justifyContent: 'flex-end',
				flexGrow: 1,
				width: '100px',
				textAlign: 'right', 
				// width: 100,
				paddingTop: 15,
				paddingRight: 25,
			}}>
				<FormattedTime time={duration * 1000} />
			</div>
		</ControlsContainer>
	)
}

export default Controls;