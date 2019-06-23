import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import styled from 'styled-components';
import axios from 'axios';

import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

import AudioBuffer from 'audio-buffer'

import Controls from './Controls'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const CANVAS_WIDTH =  window.innerWidth;
const CANVAS_HEIGHT = 200;

class Workspace extends Component {
	constructor(props) {
		super(props);

		this.state = {
			buckets: [],
			datauri: null,
			buffer: null,
			audioPos: 0,
			playing: false,
		}

		const { id } = this.props.match.params;
		this.props.loadRecordingData(id)

		this.audioElement = createRef();
		this.canvasElement = createRef();
		this.waveformMaskElement = createRef();

		this.canvasWidth = CANVAS_WIDTH;
		this.canvasHeight = CANVAS_HEIGHT;
	}

	componentDidMount() {
		const { recording } = this.props;
		this.audioCtx = new (window.AudioContext || window.wobkitAudioContext)();
		this.analyser = this.audioCtx.createAnalyser();

		ipcRenderer.on('wrk:datauri', (e, datauri) => {
			// console.log('wrk:audioBuffer, datauri:', datauri)
			this.props.loadAudioBuffer(datauri)

			this.setState({
				...this.state,
				datauri: datauri
			})

			this.source = this.audioCtx.createMediaElementSource(this.audioElement.current)
			console.log('*** Created audio source:', this.source)
			this.source.addEventListener('play', () => console.log('* play from source listener *'))

			this.analyser = this.audioCtx.createAnalyser();
			this.analyser.fftSize = 256;
			this.bufferLength = this.analyser.frequencyBinCount;
			this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
			// console.log('dataArray:', this.dataArray)
			
			let dest = []
			this.source.connect(this.analyser);
			this.analyser.connect(this.audioCtx.destination);
			
			axios({url: `http://localhost:5001/tmp/${this.props.recording.filename}`, responseType: "arraybuffer"})
			.then(response => {
				console.log('server response:', response)

				this.audioCtx.decodeAudioData(response.data, buffer => {
          var decodedAudioData = buffer.getChannelData(0);
          console.log('decodedAudioData:', decodedAudioData);

          // Bucketing algorithm from https://getstream.io/blog/generating-waveforms-for-podcasts-in-winds-2-0/
					const NUMBER_OF_BUCKETS = 500;
					let bucketDataSize = Math.floor(decodedAudioData.length / NUMBER_OF_BUCKETS);
					let buckets = [];
					for (var i = 0; i < NUMBER_OF_BUCKETS; i++) {
						let startingPoint = i * bucketDataSize;
						// console.log('*** startingPoint:', startingPoint)
						let endingPoint = i * bucketDataSize + bucketDataSize;
						let max = 0;
						for (var j = startingPoint; j < endingPoint; j++) {
							// console.log('*** decodedAudioData[j]:', decodedAudioData[j])
							if (decodedAudioData[j] > max) {
								max = decodedAudioData[j];
							}
						}
						let size = Math.abs(max);
						// console.log('*** max:', max)
						buckets.push(size / 2)
					}
					console.log('buckets:', buckets)

					this.setState({
						...this.state,
						buckets,
						buffer
					})
			
	      }, err => console.error('decodeAudioData error:', err));
			})
			.catch(err => console.error('server error:', err))

			// this.canvas = this.canvasElement.current;
			// this.canvasCtx = this.canvas.getContext('2d');
			// this.rafId = requestAnimationFrame(this.draw.bind(this));
		})

		// const _this = this;
		// window.addEventListener('resize', (e) => {
		// 	console.log('resize:', this)
		// 	this.canvasWidth = document.getInnerWidth
		// 	this.draw()
		// })
	}

	startTimer() {
		console.log('startTimer, this.audioCtx:', this.audioCtx)
		if (this.intervalID) clearInterval(this.intervalID);

		this.intervalID = setInterval(() => {
			console.log('current time:', this.audioCtx.currentTime)
			console.log(this.source.mediaElement.currentTime / this.source.mediaElement.duration)
			this.setState({
				// audioPos: (this.audioCtx.currentTime / this.source.mediaElement.duration) * 100 //  / duration
				audioPos: (this.source.mediaElement.currentTime / this.source.mediaElement.duration) * 100 //  / durration
			})
		}, 100)
	}

	renderBuckets(buckets) {
		// console.log('renderBuckets, buckets:', buckets)
		const SPACE_BETWEEN_BARS = -0.1;
		return buckets.map((bucket, i) => {
			let bucketSVGWidth = 100.0 / buckets.length;
			let bucketSVGHeight = bucket * 100.0;

			return <rect
				key={i}
				x={ bucketSVGWidth * i + SPACE_BETWEEN_BARS / 2.0 }
				y={ (50 - bucketSVGHeight) / 2.0 }
				width={ bucketSVGWidth - SPACE_BETWEEN_BARS }
				height={ bucketSVGHeight }
			/>
		})
	}

	draw() {
		this.analyser.getFloatFrequencyData(this.dataArray);
		// console.log('getFloatFrequencyData:', this.dataArray)

		this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.canvasCtx.fillStyle = '#e9eae6';
  	this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

  	const barWidth = (this.canvasWidth / this.bufferLength) * 2.5;
  	let posX = 0;
	  for (let i = 0; i < this.bufferLength; i++) {
	    const barHeight = (this.dataArray[i] + 140) * 2;
	    this.canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 150) + ', 100, 50)';
	    this.canvasCtx.fillRect(posX, this.canvasHeight - barHeight / 2, barWidth, barHeight / 2);
	    posX += barWidth + 1;
	  }

	  this.rafId = requestAnimationFrame(this.draw.bind(this));
	}

	togglePlay() {
		if (!this.state.playing) {
			console.log('play', this.source)
			this.source.mediaElement.play();
			this.startTimer();
		} else {
			console.log('stop', this.source)
			this.source.mediaElement.pause();
			clearInterval(this.intervalID);
		}


		this.setState({
			playing: !this.state.playing
		})
	}

	render() {
		const { recording, audioBuffer } = this.props;
		const { datauri, playing } = this.state;
		// console.log('Workspace, props:', this.props)
		return (
			<Container style={{
				overflowY: 'hidden'
			}}>
				<SectionTitle variant="overline">Workspace - {recording && recording.title}</SectionTitle>
				<div style={{ 
					// margin: 20 
				}}>

				{/* this.state.buckets &&
					<div style={{
						display: 'flex', 
						alignItems: 'center',
						// marginTop: 20,
					}}>
						{this.state.buckets.map((point, i) => (
							<div key={i} style={{
								backgroundColor: 'red',
								height: point,
								width: 10,
							}}>
								
							</div>
						))}
					</div>
				*/}

				{/*
				<div>
					<canvas 
						ref={this.canvasElement}
						width={this.canvasWidth}
						height={this.canvasHeight}
					/>
				</div>
				*/}

				<div style={{
					// display: 'flex',
					// width: '100%',
					// height: '100%'
					// overflowY: 'hidden'
					// height: window.innerHeight - 87
					// background: '#000'
				}}>
					<svg
						viewBox={`0 0 100 50`}
						className="waveform-container"
						preserveAspectRatio="meet"
						//width={window.innerWidth}
						//height={window.innerWidth - 87}
					>
						<rect 
							className="waveform-bg"
							x="0"
							y="0"
							width="100"
							height="100"
							style={{
								clipPath: 'url(#waveform-mask)',
								fill: 'lightgray',
							}}
						/>
						<rect
							className="waveform-progress"
							width={this.state.audioPos}
							height="100"
							style={{
								clipPath: 'url(#waveform-mask)',
								fill: '#fe9154',
							}}
						/>
					</svg>
					<svg style={{
						// display: 'none'
						height: 0
					}}>
						<defs>
							<clipPath id="waveform-mask" ref={this.waveformMaskElement}>
							{ this.state.buckets && this.renderBuckets(this.state.buckets) }
							</clipPath>
						</defs>
					</svg>
				</div>

				<div style={{
					display: 'flex',
					justifyContent: 'center',
					margin: 20,
				}}>
				{ datauri && 
					<audio 
						ref={this.audioElement}
						//controls
						src={datauri}
					/>
				}
				</div>

				{/*
				<div>
					<button onClick={() => this.togglePlay()}>{this.state.playing ? 'Pause' : 'Play'}</button>
				</div>
				*/}

				<Controls
					playing={playing}
					togglePlay={this.togglePlay.bind(this)}
				/>

				</div>
			</Container>
		)
	}
}

const mapStateToProps = state => {
	return {
		recording: state.workspace.recording,
		audioBuffer: state.workspace.audioBuffer,
	}
}

export default connect(mapStateToProps, actions)(Workspace);