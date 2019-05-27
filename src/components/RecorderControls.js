import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	position: fixed;
	bottom 0;
	width: 100%;
`

const ButtonContainer = styled.div`
	width: 100%;
`

const Button = styled.button`
	width: 100%;
	height: 50px;
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
					<Button onClick={() => handleStartRec()}>rec</Button>
					:
					<Button onClick={() => handleStopRec()}>stop</Button>
      	}
				</ButtonContainer>
		</Container>
	);
}

export default RecorderControls;