import React from 'react';
import styled from 'styled-components';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const Container = styled(List)`
	margin-bottom: 50px;
`

export default props => {
	const { recordings } = props;

	return (
		<Container>
			{recordings.map((recording, i) => (
				<ListItem key={recording._id}>
					{i+1}. 
					<audio controls>
						<source src={`${recording.src}`} />
					</audio>
				</ListItem>
			))}
		</Container>
	);
}