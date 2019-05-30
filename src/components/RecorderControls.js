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

const ControllButton = styled(Button)`
	width: 100%;
	height: 50px;
`

const RecorderControls = props => {
	const {
		isRecording,
		handleStartRec,
		handleStopRec,
		handleToggleMonitor,
		monitor,
	} = props;
	console.log('isRecording:', isRecording)
	return (
		<Container>
			<ButtonContainer width={20}>
				<ControllButton onClick={() => handleToggleMonitor(monitor)}>
					{ !monitor? <MicOffIcon /> : <MicIcon />}
				</ControllButton>
			</ButtonContainer>
    	<ButtonContainer width={80}>
    	{	!isRecording ?
				<ControllButton 
					style={{
						color: 'red',
						// border: '1px solid red',
					}} 
					onClick={() => handleStartRec()}
				>
					rec
				</ControllButton>
				:
				<ControllButton onClick={() => handleStopRec()}>stop</ControllButton>
    	}
			</ButtonContainer>
		</Container>
	);
}

export default RecorderControls;