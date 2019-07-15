import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';

import { TEST_ID } from 'constants/testIds';

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
		<Container data-testid={TEST_ID.RECORDER.CONTROLS.CONTAINER}>
			<ButtonContainer width={20}>
				<Tooltip enterDelay={500} title={ !monitoring ? 'Click to start monitor' : 'Click to stop monitor' }>
				<ControllButton 
					data-testid={ !monitoring ? TEST_ID.RECORDER.CONTROLS.MONITOR_START : TEST_ID.RECORDER.CONTROLS.MONITOR_STOP}
					onClick={() => !monitoring ? handleStartMonitor() : handleStopMonitor()}
				>
					{ !monitoring ? <MicOffIcon /> : <MicIcon /> }
				</ControllButton>
				</Tooltip>
			</ButtonContainer>
    	<ButtonContainer width={80}>
    	{	!isRecording ?
				<ControllButton
					style={{
						color: '#e63c36',
					}} 
					onClick={() => handleStartRec()}
				>
					rec
				</ControllButton>
				:
				<ControllButton
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