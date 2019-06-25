import React from 'react';
import styled from 'styled-components';

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

function Controls(props) {
	const { playing, handleTogglePlay } = props;

	return (
		<ControlsContainer>
			<IconButton onClick={() => handleTogglePlay()}>
			{!playing ? <PlayIcon /> : <PauseIcon />}
			</IconButton>
		</ControlsContainer>
	)
}

export default Controls;