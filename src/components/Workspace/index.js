import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import styled, { createGlobalStyle } from 'styled-components';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import { ThemeContext } from 'theme.context';
import { TEST_ID } from 'constants/testIds';

import {
	Container,
	SectionTitle,
} from 'components/CommonUI';
import Controls from 'components/Workspace/Controls';
import Recording from 'components/Workspace/Recording';
import Selection from 'components/Workspace/Selection';

const GlobalStyle = createGlobalStyle`
	body {
		overflow-y: hidden;
	}
`
const SelectionContainer = styled.div`
	display: flex;
	overflow-x: auto;
	padding: 20px 10px;
`

class Workspace extends Component {
	static contextType = ThemeContext;

	constructor(props) {
		super(props);

		this.state = {
			audioDuration: 0,
			currentTime: 0,
			barHeight: 2,
			zoom: 50,
			zoomedIn: false,
			selection: null,
			selections: [],
		}

		this.recorderElement = createRef();

		let params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		this.props.loadRecordingData(id)
	}

	handleTogglePlay = (e) => {
	if (!this.props.playing) {
			this.props.playWorkspace()
			document.dispatchEvent(new Event('play_workspace'))
		} else {
			this.props.pauseWorkspace();
			document.dispatchEvent(new Event('pause_workspace'))
		}
	}

	handleSeek = (time) => {
		console.log('handleSeek, currentTime:', time)
		this.setState({ 
			currentTime: time,
			// selection: null,
			// selections: [],
		});
	}

	handleEnded = () => {
		this.props.stopWorkspace();
	}

	handleWavesurferReady = duration => {
		console.log('handleWavesurferReady, duration:', duration)
		this.setState({ audioDuration: duration })
	}

	handleSetTime = (time) => {
		this.setState({ currentTime: time })
	}

	handleCreateRegion = region => {
		console.log('handleCreateRegion, region:', region)
		this.setState({ 
			selection: region,
			selections: [...this.state.selections, region]
		})
	}

	handleClearRegions = () => {
		this.setState({ selections: [] });
	}
	
	handleUpdateRegion = region => {
		console.log('handleUpdateRegion, region:', region)
		this.setState({ selection: region })
	}

	handleToggleZoom = () => {
		!this.state.zoomedIn ?
		document.dispatchEvent(new Event('zoomin_workspace'))
		:
		document.dispatchEvent(new Event('zoomout_workspace'));

		this.setState({ zoomedIn: !this.state.zoomedIn })
	}

	// zoomIn = () => {
	// 	console.log('zoom')
	// 	this.setState({ zoom: 100, zoomedIn: true })
	// 	this.wavesurfer.zoom(100)
	// }

	// zoomOut = () => {
	// 	console.log('zoom')
	// 	this.setState({ zoom: 0, zoomedIn: false })
	// 	this.wavesurfer.zoom(0)
	// }

	render() {
		const { 
			recording,
			playing, 
		} = this.props;

		return (
			<Container>
				<GlobalStyle />
				<SectionTitle variant="overline">Workspace - {recording && recording.title}</SectionTitle>
				<div>

					{ 
						recording && 
						<Recording
							ref={this.recorderElement}
							recording={recording}
							audioDuration={this.state.audioDuration}
							playing={playing}
							barHeight={this.state.barHeight}
							zoomedIn={this.state.zoomedIn}
							handleWavesurferReady={this.handleWavesurferReady}
							handleSeek={this.handleSeek}
							handleSetTime={this.handleSetTime}
							handleEnded={this.handleEnded}
							handleCreateRegion={this.handleCreateRegion}
							handleUpdateRegion={this.handleUpdateRegion}
							handleClearRegions={this.handleClearRegions}
						/> 
					}

					{/* this.state.selection &&
						<Selection 
							start={this.state.selection.start}
							end={this.state.selection.start}
						/>
					*/}

					<SelectionContainer>
					{ 
						this.state.selections.map((selection, i) => (
							<Selection 
								key={i}
								start={this.state.selections[i].start}
								end={this.state.selections[i].end}
							/>
						))
					}
					</SelectionContainer>

					<Controls
						playing={playing}
						time={this.state.currentTime}
						duration={this.state.audioDuration}
						zoomedIn={this.state.zoomedIn}
						handleTogglePlay={this.handleTogglePlay}
						handleToggleZoom={this.handleToggleZoom}
					/>

				</div>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	return {
		recording: state.workspace.recording,
		playing: state.workspace.playing,
	}
}

export default connect(mapStateToProps, actions)(Workspace);
