import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'theme.context';

import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import FormattedTime from 'components/FormattedTime';

const ControlsContainer = styled.div`
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 10px;
`

const TimeInfo = styled.div`
	// border: 1px solid red;
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
		handleTogglePlay,
	} = props;

	const theme = useContext(ThemeContext)
	// console.log('*** theme:', theme)
	return (
		<ControlsContainer>
			<TimeInfo theme={theme}>
				<FormattedTime time={time * 1000} />
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