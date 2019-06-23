import React from 'react';
import styled, {GlobalStyles} from 'styled-components';

const Controls = props => {
	const { playing } = props;

	const handleTogglePlay = () => {
		props.togglePlay();
	} 

	return (
		<div>
			<button onClick={() => handleTogglePlay()}>{playing ? 'Pause' : 'Play'}</button>
		</div>
	)
}

export default Controls;