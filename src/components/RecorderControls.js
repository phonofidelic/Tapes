import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';

const Container = styled.div`
	display: flex;
	position: fixed;
	bottom 0;
	width: 100%;
`

const ButtonContainer = styled.div`
	width: 100%;
`

const RecButton = styled(Button)`
	width: 100%;
	height: 50px;
	color: red;
`

const RecorderControls = props => {
	const {
		isRecording,
		handleStartRec,
		handleStopRec,
	} = props;
	console.log('isRecording:', isRecording)
	return (
		<Container>
      	<ButtonContainer>
      	{	!isRecording ?
					<RecButton onClick={() => handleStartRec()}>rec</RecButton>
					:
					<RecButton onClick={() => handleStopRec()}>stop</RecButton>
      	}
				</ButtonContainer>
		</Container>
	);
}

export default RecorderControls;