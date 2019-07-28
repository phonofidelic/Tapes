import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function FormattedTime(props) {
	const { 
		time,
		variant,
		noWrap,
	} = props;

	let centiseconds = ('0' + (Math.floor(time / 10) % 100)).slice(-2);
	let seconds = ('0' + (Math.floor(time / 1000) % 60)).slice(-2);
	let minutes = ('0' + (Math.floor(time / 60000) % 60)).slice(-2);
	let hours = ('0' + Math.floor(time / 360000)).slice(-2);
	return (
		<Typography 
			style={{
				display: props.display,
				margin: 0,
			}}
			variant={variant}
			noWrap={noWrap}
		>
			{hours} : {minutes} : {seconds} : {centiseconds}
		</Typography>
	);
}