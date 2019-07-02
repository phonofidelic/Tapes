import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'theme.context';
import ReactStopwatch from 'react-stopwatch';

import Typography from '@material-ui/core/Typography';

const Container = styled.div`
	background-color: #e63c36;
	// display: flex;
	// padding-left: 8px;
	height: 19px;
	line-height: 19px;
	vertical-align: middle;
	position: absolute;
	width: 100%;
	// text-align: center;
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
				<Typography
					variant="caption"
					align="right"
				>
					<b>
						<ReactStopwatch 
							seconds={0}
					    minutes={0}
					    hours={0}
					    onCallback={() => console.log('Finish')}
					    render={({formatted, hours, minutes, seconds}) => {
					    	return (
					    		<div>{ formatted }</div>
					    	)
					    }}
						/>
					</b>
				</Typography>
			</div>
		</Container>
	)
}

export default RecordingIndicator;
