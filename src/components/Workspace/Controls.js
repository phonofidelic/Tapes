import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'theme.context';

import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

const ControlsContainer = styled.div`
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 10px;
`

const TimeInfo = styled.div`
	width: 100px;
	padding-top: 15px;
	flex-grow: 1;
	text-align: center;
`

function Controls(props) {
	const { 
		playing,
		time,
		duration,
		handleTogglePlay,
	} = props;

	const theme = useContext(ThemeContext)
	console.log('*** theme:', theme)
	return (
		<ControlsContainer>
			<TimeInfo theme={theme}>
				<span style={{width: 50}}>{time.toFixed(2)}</span> / <span style={{width: 50}}>{duration.toFixed(2)}</span>
			</TimeInfo>
			<div style={{flexGrow: 1, textAlign: 'center'}}>
				<IconButton onClick={() => handleTogglePlay()}>
				{!playing ? <PlayIcon /> : <PauseIcon />}
				</IconButton>
			</div>
			<div style={{
				flexGrow: 1, 
				width: 100,
				textAlign: 'center'
			}}>
			</div>
		</ControlsContainer>
	)
}

export default Controls;