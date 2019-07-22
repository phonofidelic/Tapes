import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import { createGlobalStyle } from 'styled-components';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import { ThemeContext } from 'theme.context';
import { TEST_ID } from 'constants/testIds';

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
			zoom: 50,
			zoomedIn: false,
			selection: null,
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
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
      container: this.timelineEl.current
    });

    this.cursorPlugin = CursorPlugin.create({
    	zIndex: -1,
    	customShowTimeStyle: {
				marginLeft: '10px'
    	},
			showTime: true,
    })

    this.regionsPlugin = RegionsPlugin.create({
			// loop: true
    })

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
      // hideScrollbar: true,
      autoCenter: false,
      plugins: [
		    this.timelinePlugin,
		    this.cursorPlugin,
		    this.regionsPlugin
		  ]
    });

    this.wavesurfer.load(srcURL);

    /**
     * Wavesurfer event handlers
     */

    this.wavesurfer.on('ready', () => {
    	this.setDuration(this.wavesurfer.getDuration());
    	this.wavesurfer.enableDragSelection({ 
    		loop: true 
    	});
  	});

    this.wavesurfer.on('finish', () => this.handleEnded());

    this.wavesurfer.on('seek', progress => {
    	this.handleSeek()
    	console.log('regions:', this.wavesurfer.regions)
    	this.wavesurfer.clearRegions()
    	this.setState({ selection: null })
    });
		
		this.wavesurfer.on('region-created', region => {
			console.log('region-created, region:', region)
			
			setTimeout(() => {
				this.setState({
					selection: {
						start: region.start,
						end: region.end
					}
				})
			}, 100)
		});

		this.wavesurfer.on('region-updated', region => {			
			setTimeout(() => {
				this.setState({
					selection: {
						start: region.start,
						end: region.end
					}
				})
			}, 100)
		})
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

	zoomIn = () => {
		console.log('zoom')
		this.setState({ zoom: 100, zoomedIn: true })
		this.wavesurfer.zoom(100)
	}

	zoomOut = () => {
		console.log('zoom')
		this.setState({ zoom: 0, zoomedIn: false })
		this.wavesurfer.zoom(0)
	}

	handleToggleZoom = () => {
		!this.state.zoomedIn ? this.zoomIn() : this.zoomOut()
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
						<div 
							id="timeline" 
							data-testid={TEST_ID.WORKSPACE.TRACK.TIMELINE}
							ref={this.timelineEl}
						/>
						<div
							id="waveform"
							style={{overflowX: 'hidden'}}
							data-testid={TEST_ID.WORKSPACE.TRACK.WORKSPACE}
							ref={this.waveformEl}
							onDoubleClick={this.handleZoom}
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

					{ this.state.selection &&
						<div>
							<div>Selection:</div>
							<div>start: {this.state.selection.start}</div>
							<div>end: {this.state.selection.end}</div>
						</div>
					}

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
	}
}

export default connect(mapStateToProps, actions)(Workspace);