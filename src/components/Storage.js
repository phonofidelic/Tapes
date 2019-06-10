import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/storage.actions';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class Storage extends Component {
	constructor(props) {
		super(props);
		ipcRenderer.on('storage:loadRecordings:response', (e, recordings) => this.props.loadRecordings(recordings))
	}

	componentDidMount() {
		const { saveDir } = this.props;
		ipcRenderer.send('storage:loadRecordings', saveDir)

	}

	render() {
		const { recordings } = this.props;
		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Storage</SectionTitle>
					<List>
					{ recordings && recordings.map((recording, i) => (
						<ListItem key={i}>{recording}</ListItem>
					))}
					</List>
				</Section>
			</Container>
		);
	}
}

const mapStateToProps = state => {
	return {
		saveDir: state.settings.saveDir,
		recordings: state.storage.recordings,
	}
}

export default connect(mapStateToProps, actions)(Storage);