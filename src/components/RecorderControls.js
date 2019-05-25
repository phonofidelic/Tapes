import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
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
		onStartRec,
		onStopRec
	} = props;
	return (
		<Container>
			<ButtonContainer>
				<Button onClick={() => onStartRec()}>rec</Button>
			</ButtonContainer>
			<ButtonContainer>
      	<Button onClick={() => onStopRec()}>stop</Button>
      </ButtonContainer>
		</Container>
	);
}

export default RecorderControls;