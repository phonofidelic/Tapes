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
import RegionInfo from 'components/Workspace/RegionInfo';

const GlobalStyle = createGlobalStyle`
	body {
		// overflow-y: hidden;
	}
`
const RegionsContainer = styled.div`
	display: flex;
	overflow-x: auto;
	min-width: 530px;
	padding: 10px 10px;
	margin-bottom: ${({theme}) => theme.dimensions.workspaceControlsHeight}px;
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
			// region: null,
			regions: [],
			selectedRegion: null,
		}

		let params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		this.props.loadRecordingData(id)
	}

	handleTogglePlay = (e) => {
		if (!this.props.playing) {
			this.props.playWorkspace();
			document.dispatchEvent(new Event('workspace_play'));
		} else {
			this.props.pauseWorkspace();
			document.dispatchEvent(new Event('workspace_pause'));
		}
	}

	handlePlay = () => {
		this.props.playWorkspace();
	}

	handlePause = () => {;
		this.props.pauseWorkspace();
	}

	handleSeek = (time) => {
		this.setState({ 
			currentTime: time,
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
		// console.log('handleCreateRegion, region:', region)
		this.setState({ 
			// region: region,
			regions: [...this.state.regions, region]
		})
	}

	handleSelectRegion = region => {
		// console.log('handleSelectRegion, region:', region)
		document.dispatchEvent(
			new CustomEvent('workspace_selectregion', { 'detail': region })
		)

		this.setState({
			selectedRegion: region,
			currentTime: region.start
		})
	}

	handleClearRegions = () => {
		this.setState({ regions: [] });
	}
	
	handleUpdateRegion = region => {
		// console.log('handleUpdateRegion, region:', region)
		this.setState({ region: region })
	}

	handleToggleZoom = () => {
		!this.state.zoomedIn ?
		document.dispatchEvent(new Event('workspace_zoomin'))
		:
		document.dispatchEvent(new Event('workspace_zoomout'));

		this.setState({ zoomedIn: !this.state.zoomedIn })
	}

	render() {
		const { 
			recording,
			playing, 
		} = this.props;

		const theme = this.context;

		return (
			<Container>
				<GlobalStyle />
				<SectionTitle variant="overline">Workspace - {recording && recording.title}</SectionTitle>
				<div>

					{ 
						recording && 
						<Recording
							recording={recording}
							audioDuration={this.state.audioDuration}
							playing={playing}
							barHeight={this.state.barHeight}
							selectedRegion={this.state.selectedRegion}
							zoomedIn={this.state.zoomedIn}
							handleWavesurferReady={this.handleWavesurferReady}
							handleSeek={this.handleSeek}
							handleSetTime={this.handleSetTime}
							handleEnded={this.handleEnded}
							handleCreateRegion={this.handleCreateRegion}
							handleUpdateRegion={this.handleUpdateRegion}
							handleSelectRegion={this.handleSelectRegion}
							handleClearRegions={this.handleClearRegions}
							handlePlay={this.handlePlay}
							handlePause={this.handlePause}
						/> 
					}

					<RegionsContainer theme={theme}>
					{ 
						this.state.regions.map((region, i) => (
							<RegionInfo 
								key={i}
								count={i}
								region={region}
								recording={recording}
								selectedRegion={this.state.selectedRegion}
								handleSelectRegion={this.handleSelectRegion}
							/>
						))
					}
					</RegionsContainer>

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
