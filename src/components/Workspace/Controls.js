import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'theme.context';
import { TEST_ID } from 'constants/testIds';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import FollowIcon from '@material-ui/icons/TrendingFlat';

import FormattedTime from 'components/FormattedTime';

const Container = styled.div`
	// border: 1px solid blue;
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: center;
`

const ControlsContainer = styled.div`
	// border: 1px solid green;
	display: flex;
	width: 100%;
	flex-grow: 1;
	justify-content: center;
	padding: 10px;
`
const PlaybackControls = styled.div`
	// border: 1px solid orange;
	margin-right: 50px;
	align-self: center;
	// flex-grow: 1;
`

const ZoomControls = styled.div`
	// border: 1px solid orange;
	display: flex;
	width: 95px;
	// flex-grow: 1;
`

const TimeInfoContainer = styled.div`
	// border: 1px solid green;
	display: flex;
	justify-content: ${props => props.justifyContent};
	text-align: ${props => props.textAlign | 'left'};
	width: 100%;
	padding-top: 25px;
	padding-right: 20px;
	padding-left: 20px;
	flex-grow: 1;
	// text-align: justify;
`

function Controls(props) {
	const { 
		playing,
		time,
		duration,
		zoomedIn,
		handleTogglePlay,
		handleToggleZoom,
	} = props;

	const theme = useContext(ThemeContext)
	// console.log('*** theme:', theme)
	return (
		<Container data-testid={TEST_ID.WORKSPACE.CONTROLS.CONTAINER}>
			{/*<div style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '50vw',
				height: '100vh',
				border: '1px solid red',
			}}>
			</div>*/}

			<TimeInfoContainer 
				theme={theme}
				justifyContent="flex-start"
			>
				<FormattedTime time={time * 1000} />
			</TimeInfoContainer>

			<ControlsContainer>
				<PlaybackControls>
					<IconButton onClick={() => handleTogglePlay()}>
					{!playing ? <PlayIcon /> : <PauseIcon />}
					</IconButton>
				</PlaybackControls>

				<ZoomControls>
					<IconButton onClick={() => handleToggleZoom()}>
						{ !zoomedIn ? <ZoomInIcon /> : <ZoomOutIcon /> }
					</IconButton>
					{ false &&
						<Tooltip enterDelay={300} title="Follow cursor">
							<IconButton>
								<FollowIcon color="disabled" />
							</IconButton>
						</Tooltip>
					}
				</ZoomControls>
			</ControlsContainer>

			{/*<div style={{
				// border: '1px solid red',
				display: 'flex',
				justifyContent: 'flex-end',
				flexGrow: 1,
				width: '100px',
				textAlign: 'right', 
				// width: 100,
				paddingTop: 15,
				paddingRight: 25,
			}}>
				<FormattedTime time={duration * 1000} />
			</div>*/}
			<TimeInfoContainer 
				theme={theme}
				justifyContent="flex-end"
			>
				<FormattedTime time={duration * 1000} />
			</TimeInfoContainer>

		</Container>
	)
}

export default Controls;