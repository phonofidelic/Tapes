import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';
import { ThemeContext } from 'theme.context'

import Controls from 'components/Workspace/Controls';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const CANVAS_WIDTH =  window.innerWidth;
const CANVAS_HEIGHT = 200;

const GlobalStyle = createGlobalStyle`
	body {
		overflow-y: hidden;
	}
`

class Workspace extends Component {
	static contextType = ThemeContext;

	constructor(props) {
		super(props);

		this.state = {
			audioTime: 0,
			audioTimePercent: 0,
			audioDuration: 0,
			playing: false,
			barHeight: 10,
		}

		let params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		this.props.loadRecordingData(id)

		this.audioElement = createRef();
		this.waveformMaskElements = [createRef() ,createRef()];
		this.waveformEl = createRef();
		this.timelineEl = createRef();

		this.canvasWidth = CANVAS_WIDTH;
		this.canvasHeight = CANVAS_HEIGHT;
	}

	componentDidMount() {
		this.audioCtx = new (window.AudioContext || window.wobkitAudioContext)();
		this.analyser = this.audioCtx.createAnalyser();
	}

	handleOnLoadedMetadata = (e) => {
		console.log('handleAudioElementMounted, e:', e)
		this.source = this.audioCtx.createMediaElementSource(this.audioElement.current)
		this.source.connect(this.audioCtx.destination);
				
		this.setState({
			audioDuration: e.target.duration,
		})

		this.audioElement.current.addEventListener('ended', (e) => {
			console.log('*** Recording ended')
			clearInterval(this.intervalID);
			this.setState({
				playing: false
			})
		})
		
		this.loadWaveformDada();
	}

	loadWaveformDada = () => {
		const theme = this.context;
		const { recording } = this.props;
		const channelCount = parseInt(recording.format.channels, 10); // TODO: fix spelling on channels prop
		const srcURL = `http://localhost:5000/recordings/${recording.filename}`
		
		console.log('channelCount:', channelCount)
		this.timelinePlugin = TimelinePlugin.create({
      // plugin options ...
      container: this.timelineEl.current
    });
		this.wavesurfer = WaveSurfer.create({
      container: this.waveformEl.current,
      waveColor: 'lightgray',
      progressColor: theme.palette.primary.accent,
      cursorColor: theme.palette.primary.accent,
      responsive: true,
      audioContext: this.audioCtx,
      barHeight: this.state.barHeight,
      splitChannels: channelCount === 2,
      height: 200 / channelCount,
      plugins: [
		    this.timelinePlugin
		  ]
    });
    this.wavesurfer.load(srcURL);
	}

	startTimer = () => {
		// console.log('startTimer, this.audioCtx:', this.audioCtx)
		if (this.intervalID) clearInterval(this.intervalID);

		this.intervalID = setInterval(() => {
			// console.log('time:', this.source.mediaElement.currentTime)
			this.setState({
				audioTime: this.source.mediaElement.currentTime,
				audioTimePercent: (this.source.mediaElement.currentTime / this.source.mediaElement.duration) * 100 //  / durration
			})
		}, 100)
	}

	handleTogglePlay = (e) => {
		if (!this.state.playing) {
			console.log('play', this.source)
			this.source.mediaElement.play();
			this.wavesurfer.play();
			this.startTimer();
		} else {
			console.log('stop', this.source)
			this.source.mediaElement.pause();
			this.wavesurfer.pause();
			clearInterval(this.intervalID);
		}

		this.setState({
			playing: !this.state.playing
		})
	}

	handleProgressClick = (e) => {
		console.log('handleProgressClick', e)
		// Get time position from click X pos
		const time = (e.clientX / window.innerWidth) * this.state.audioDuration;
		// console.log(time)
		this.source.mediaElement.currentTime = time;

		// Play audio from new position
		this.source.mediaElement.play();
		this.wavesurfer.play();
		clearInterval(this.intervalID);
		this.startTimer();
		this.setState({ playing: true });
	}

	render() {
		const { recording } = this.props;
		const { playing } = this.state;
		const theme = this.context;

		// console.log('Workspace, timeMetrics:', this.state.timeMetrics)
		return (
			<Container>
				<GlobalStyle />
				<SectionTitle variant="overline">Workspace - {recording && recording.title}</SectionTitle>
				<div style={{ 
					// margin: 20 
				}}>

					<div>
						<div id="timeline" ref={this.timelineEl} />
						<div
							id="waveform" 
							ref={this.waveformEl}
							onClick={this.handleProgressClick}
						/>
					</div>

					{ recording && 
						<audio 
							ref={this.audioElement}
							//controls
							preload="true"
							crossOrigin="anonymous"
							src={`http://localhost:5000/recordings/${recording.filename}`}
							onLoadedMetadata={this.handleOnLoadedMetadata}
						/>
					}

					<Controls
						playing={playing}
						time={this.state.audioTime}
						duration={this.state.audioDuration}
						handleTogglePlay={this.handleTogglePlay}
					/>

				</div>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	return {
		recording: state.workspace.recording,
	}
}

export default connect(mapStateToProps, actions)(Workspace);