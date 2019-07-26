import React from 'react';
import styled from 'styled-components';

import FormattedTime from 'components/FormattedTime';

const Container = styled.div`
	margin: 0 10px;
	max-height: 54px;
	min-width: 190px;
`

const Selection = props => {
	const {
		start,
		end
	} = props;

	return (
		<Container>
			<div>Selection:</div>
			<div>start: {<FormattedTime time={start * 1000} display="inline" />}</div>
			<div>end: {<FormattedTime time={end * 1000} display="inline" />}</div>
		</Container>
	)
}

export default Selection;