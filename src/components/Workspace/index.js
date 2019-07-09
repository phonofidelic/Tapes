import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import { createGlobalStyle } from 'styled-components';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import { ThemeContext } from 'theme.context'

import {
	Container,
	SectionTitle,
} from 'components/CommonUI';
import Controls from 'components/Workspace/Controls';

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
			audioDuration: 0,
			playing: false,
			currentTime: 0,
			barHeight: 2,
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
		console.log('handleAudioElementMounted, e.target.duration:', e.target.duration)
		this.source = this.audioCtx.createMediaElementSource(this.audioElement.current)
		this.source.connect(this.audioCtx.destination);
		
		this.audioElement.current.addEventListener('ended', (e) => {
			console.log('*** Recording ended')
			clearInterval(this.intervalID);
			this.setState({
				playing: false
			})
		})
		
		this.loadWaveformDada();
	}

	handleOnComplete = e => {
		console.log('handleOnComplete, e.target.duration:', e.target.duration)
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

    this.wavesurfer.on('ready', () => this.setDuration(this.wavesurfer.getDuration()));
    this.wavesurfer.on('finish', () => this.handleEnded());
    this.wavesurfer.on('seek', progress => this.handleSeek());
	}

	setDuration = duration => {
		console.log('setDuration, duration:', duration)
		this.setState({ audioDuration: duration })
	}

	startTimer = () => {
		if (this.intervalID) clearInterval(this.intervalID);

		this.intervalID = setInterval(() => {
			// console.log('wavesurfer time:', Math.trunc(this.wavesurfer.getCurrentTime()*1000))
			this.setState({
				currentTime: this.wavesurfer.getCurrentTime(),
			})
		}, 1)
	}

	stopTimer = () => {
		if (this.intervalID) clearInterval(this.intervalID);
	}

	handleTogglePlay = (e) => {
		if (!this.state.playing) {
			console.log('play', this.source)
			this.wavesurfer.play();
			this.startTimer();
		} else {
			console.log('stop', this.source)
			this.wavesurfer.pause();
			this.stopTimer();
		}

		this.setState({
			playing: !this.state.playing
		})
	}

	handleSeek = () => {
		console.log('handleSeek, currentTime:', this.wavesurfer.getCurrentTime())
		this.setState({ 
			currentTime: this.wavesurfer.getCurrentTime(),
		});
	}

	handleEnded = () => {
		console.log('handleEnded')
		this.wavesurfer.stop();
		this.stopTimer();
		this.setState({ 
			currentTime: 0,
			playing: false,
		});
	}

	render() {
		const { recording } = this.props;
		const { playing } = this.state;

		return (
			<Container>
				<GlobalStyle />
				<SectionTitle variant="overline">Workspace - {recording && recording.title}</SectionTitle>
				<div>

					<div>
						<div id="timeline" ref={this.timelineEl} />
						<div
							id="waveform" 
							ref={this.waveformEl}
						/>
					</div>

					{ recording && 
						<audio 
							ref={this.audioElement}
							//controls
							preload="auto"
							crossOrigin="anonymous"
							src={`http://localhost:5000/recordings/${recording.filename}`}
							onLoadedMetadata={this.handleOnLoadedMetadata}
							onEnded={this.handleEnded}
						/>
					}

					<Controls
						playing={playing}
						time={this.state.currentTime}
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