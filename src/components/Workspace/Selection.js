import React from 'react';

const Selection = props => {
	const {
		start,
		end
	} = props;

	return (
		<div>
			<div>Selection:</div>
			<div>start: {start}</div>
			<div>end: {end}</div>
		</div>
	)
}

export default Selection;