import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
	position: fixed;
	bottom: 0;
	width: 100%;
`

const Controls = props => {
	const { playing } = props;

	const handleTogglePlay = () => {
		props.togglePlay();
	} 

	return (
		<ControlsContainer>
			<button onClick={() => handleTogglePlay()}>{playing ? 'Pause' : 'Play'}</button>
		</ControlsContainer>
	)
}

export default Controls;