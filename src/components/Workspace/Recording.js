import React, { Component, createRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';

import { ThemeContext } from 'theme.context';
import { TEST_ID } from 'constants/testIds';


class Recording extends Component {
	static contextType = ThemeContext;

	constructor(props) {
		super(props);

		this.audioElement = createRef();
		this.waveformEl = createRef();
		this.timelineEl = createRef();
	}

	componentDidMount() {
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = this.audioCtx.createAnalyser();
	}

	componentWillReceiveProps(nextProps) {
		// console.log('Recording, nextProps:', nextProps)
		nextProps.playing ? this.play() : this.pause();
	}

	handleOnLoadedMetadata = (e) => {
		console.log('handleOnLoadedMetadata, e.target.duration:', e.target.duration)
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
      barHeight: this.props.barHeight,
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

    this.wavesurfer.on('ready', () => this.handleReady());

    this.wavesurfer.on('finish', () => this.stop());
    this.wavesurfer.on('seek', progress => {
    	this.seek(this.wavesurfer.getCurrentTime())
    });
		this.wavesurfer.on('region-created', region => this.createRegion(region));
		this.wavesurfer.on('region-updated', region => this.updateRegion(region));
	}

	createRegion = region => {
		console.log('region-created, region:', region)
		setTimeout(() => {
			this.wavesurfer.seekTo(region.start / this.props.audioDuration)

			// TODO: this.props.createTape(region.start, region.end)
			this.props.handleCreateRegion(region);
		}, 100)
	}

	updateRegion = region => {
		console.log('region-updated, region:', region)
		setTimeout(() => {
			this.wavesurfer.seekTo(region.start / this.props.audioDuration)

			// TODO: this.props.updateTape(region.start, region.end)
			this.props.handleUpdateRegion(region);
		}, 100)
	}

	handleReady = () => {
		this.props.handleWavesurferReady(this.wavesurfer.getDuration())
		this.wavesurfer.enableDragSelection({ 
  		loop: true 
  	});
	}

	startTimer = () => {
		if (this.intervalID) clearInterval(this.intervalID);

		this.intervalID = setInterval(() => {
			this.props.handleSetTime(this.wavesurfer.getCurrentTime())
		}, 1)
	}

	stopTimer = () => {
		if (this.intervalID) clearInterval(this.intervalID);
	}

	play = () => {
		this.wavesurfer.play();
		this.startTimer();
	}

	pause = () => {
		this.wavesurfer.pause();
		this.stopTimer();
	}

	stop = () => {
		this.wavesurfer.stop();
		this.stopTimer();
		this.props.handleSetTime(0);
		this.props.handleEnded();
	}

	seek = (time) => {
		this.props.handleSeek(time)
	}

	render() {
		const { 
			recording,
			playing,
		} = this.props;

		return (
			<div>
				<div 
					id="timeline" 
					data-testid={TEST_ID.WORKSPACE.TRACK.TIMELINE}
					ref={this.timelineEl}
				/>
				<div
					id="waveform"
					data-testid={TEST_ID.WORKSPACE.TRACK.WORKSPACE}
					ref={this.waveformEl}
					onDoubleClick={this.handleZoom}
					onClick={() => this.wavesurfer.clearRegions()}
				/>
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
			</div>
		)
	}
}

export default Recording;
