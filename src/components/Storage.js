import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

class Storage extends Component {
	render() {
		return (
			<Container>
				<Section>
					<SectionTitle>Storage</SectionTitle>
				</Section>
			</Container>
		);
	}
}

export default Storage