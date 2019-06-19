import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import styled from 'styled-components';

import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';


class Workspace extends Component {
	render() {
		return (
			<Container>
			<SectionTitle variant="overline">Workspace</SectionTitle>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	return {
		locationPathname: state.router.location.pathname
	}
}

export default connect(mapStateToProps, )(Workspace);