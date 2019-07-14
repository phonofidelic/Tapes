import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

const Container = styled.div`
	display: flex;
	position: fixed;
	bottom 0;
	width: 100%;
`

const ButtonContainer = styled.div`
	width: ${props => props.width}%;
`

export const ControllButton = styled(Button)`
	width: 100%;
	height: 50px;
`

const RecorderControls = props => {
	const {
		isRecording,
		handleStartRec,
		handleStopRec,
		handleStartMonitor,
		handleStopMonitor,
		monitoring,
	} = props;

	return (
		<Container data-testid="recorder-controls_container">
			<ButtonContainer width={20}>
				<ControllButton onClick={() => !monitoring ? handleStartMonitor() : handleStopMonitor()}>
					{ !monitoring ? <MicOffIcon /> : <MicIcon />}
				</ControllButton>
			</ButtonContainer>
    	<ButtonContainer width={80}>
    	{	!isRecording ?
				<ControllButton
					data-testid="recorder-controls_rec-button"
					style={{
						color: '#e63c36',
					}} 
					onClick={() => handleStartRec()}
				>
					rec
				</ControllButton>
				:
				<ControllButton
					data-testid="recorder-controls_stop-button"
					onClick={() => handleStopRec()}
				>
					stop
				</ControllButton>
    	}
			</ButtonContainer>
		</Container>
	);
}

export default RecorderControls;