import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'theme.context';

import Typography from '@material-ui/core/Typography';

import Timer from 'components/Timer';

const Container = styled.div`
	background-color: #e63c36;
	height: 19px;
	line-height: 19px;
	vertical-align: middle;
	position: absolute;
	width: 100%;
`

function RecordingIndicator(props) {
	const theme = useContext(ThemeContext)
	
	return (
		<Container>
			<div style={{
				color: theme.palette.primary.light,
				textAlign: 'right',
				paddingRight: 8
			}}>
				<Typography
					variant="caption"
				>
					<b>RECORDING</b>
				</Typography>
			</div>
			<div style={{
				color: theme.palette.primary.dark,
				textAlign: 'right',
				paddingRight: 8
			}}>				
				<Timer />
			</div>
		</Container>
	)
}

export default RecordingIndicator;
