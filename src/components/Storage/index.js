import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/storage.actions';
import styled from 'styled-components';

import List from '@material-ui/core/List';

import StorageItem from 'components/Storage/StorageItem';
import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

const StyledList = styled(List)`
	padding: 0px;
`

class Storage extends Component {
	constructor(props) {
		super(props);
		ipcRenderer.on('storage:loadRecordings:response', this.handleLoadRecordings)
	}

	componentDidMount() {
		const { saveDir } = this.props;
		saveDir && ipcRenderer.send('storage:loadRecordings', saveDir)
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('storage:loadRecordings:response', this.handleLoadRecordings)
	}

	handleLoadRecordings = (e, recordings) => {
		this.props.loadRecordings(recordings)
	}

	handleDeleteRecording = (id, path) => {
		this.props.deleteRecording(id, path)
	}

	render() {
		const { recordings, saveDir } = this.props;

		console.log('Storage, recordings:', recordings)
		return (
			<Container>
				<Section>
					<SectionTitle variant="overline">Storage</SectionTitle>
					<List 
						disablePadding
						dense
						subheader={saveDir ? 
							<SectionTitle variant="caption" style={{backgroundColor: '#666'}}>{saveDir}:</SectionTitle>
							:
							false
						}
					>
					{ recordings.map(recording => (
						<StorageItem 
							key={recording.id}
							recording={recording}
							handleDeleteRecording={this.handleDeleteRecording}
						/>
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