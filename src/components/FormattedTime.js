import React from 'react';

export default function FormattedTime(props) {
	const { time } = props;

	let centiseconds = ('0' + (Math.floor(time / 10) % 100)).slice(-2);
	let seconds = ('0' + (Math.floor(time / 1000) % 60)).slice(-2);
	let minutes = ('0' + (Math.floor(time / 60000) % 60)).slice(-2);
	let hours = ('0' + Math.floor(time / 360000)).slice(-2);
	return (
		<div>
			{hours} : {minutes} : {seconds} : {centiseconds}
		</div>
	);
}