import React, { Component, createRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import uuidv4 from 'uuid/v4';

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
		document.addEventListener('workspace_play', e => this.play());
		document.addEventListener('workspace_pause', e => this.pause());
		document.addEventListener('workspace_zoomin', e => this.zoomIn());
		document.addEventListener('workspace_zoomout', e => this.zoomOut());
		document.addEventListener('workspace_selectregion', e => {
			this.wavesurfer.seekTo(e.detail.start / this.props.audioDuration)

			console.log('workspace_selectregion, current time:', this.wavesurfer.getCurrentTime())
			setTimeout(() => {
				for (var region in this.wavesurfer.regions.list) {
					this.wavesurfer.regions.list[region].color = 'rgba(0, 0, 0, 0.1)';
					this.wavesurfer.regions.list[this.props.selectedRegion.id].color = 'rgba(245, 145, 85, 0.5)';
					this.wavesurfer.regions.list[region].updateRender();
				}
			}, 1);
		});

		this.loadWaveformData();
	}

	loadWaveformData = () => {
		const theme = this.context;
		const { recording } = this.props;
		const channelCount = parseInt(recording.format.channels, 10); // TODO: fix spelling on channels prop
		const srcURL = `http://localhost:5000/recordings/${recording.filename}`;
		
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
    });

    this.regionsPlugin = RegionsPlugin.create({
			// loop: true
    });

		this.wavesurfer = WaveSurfer.create({
      container: this.waveformEl.current,
      waveColor: 'lightgray',
      progressColor: theme.palette.primary.accent,
      cursorColor: theme.palette.primary.accent,
      responsive: true,
      // barHeight: this.props.barHeight,
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

    this.wavesurfer.on('seek', progress => this.seek(this.wavesurfer.getCurrentTime()));

		this.wavesurfer.on('region-created', region => this.createRegion(region));

		this.wavesurfer.on('region-updated', region => this.updateRegion(region));
	}

	createRegion = region => {
		console.log('region-created, region:', region)
		
		region.id = uuidv4();

		/**
     * Region event handlers
     */
		region.on('click', e => {
			e.stopPropagation();
			this.props.handleSelectRegion(region);
		});

		region.on('update', () => {
			if (this.props.playing) this.pause();
		});

		region.on('update-end', () => {
			setTimeout(() => {
				if (this.props.playing) this.play();
			}, 100);
		});

		region.on('over', e => {
			console.log('region hover, e:', e)
		});

		this.props.handleSelectRegion(region);

		setTimeout(() => {
			// this.wavesurfer.seekTo(region.start / this.props.audioDuration)
			this.props.handleCreateRegion(region);
		}, 100);
	}

	updateRegion = region => {
		setTimeout(() => {
			this.wavesurfer.seekTo(region.start / this.props.audioDuration)

			// TODO: this.props.updateTape(region.start, region.end)
			this.props.handleUpdateRegion(region);
		}, 100);
	}

	clearRegions = () => {
		this.wavesurfer.clearRegions();
		this.props.handleClearRegions();
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
			this.props.handleSetTime(this.wavesurfer.getCurrentTime());
		}, 1);
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
		// console.log('seek, time:', time / this.props.audioDuration)
		// this.wavesurfer.seekTo(time / this.props.audioDuration)
		this.props.handleSeek(time);
	}

	zoomIn = () => {
		this.wavesurfer.zoom(100);
	}

	zoomOut = () => {
		this.wavesurfer.zoom(0);
	}

	render() {
		const { 
			recording,
			playing,
		} = this.props;

		// console.log('this.wavesurfer:', this.wavesurfer)

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
					onClick={() => this.clearRegions()}
				/>
			</div>
		);
	}
}

export default Recording;
