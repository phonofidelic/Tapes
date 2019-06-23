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
			audioPos: 0,
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


			const source = this.audioCtx.createMediaElementSource(this.audioElement.current)
			console.log('*** Created audio source:', source)

			this.analyser = this.audioCtx.createAnalyser();
			this.analyser.fftSize = 256;
			this.bufferLength = this.analyser.frequencyBinCount;
			this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
			// console.log('dataArray:', this.dataArray)
			
			let dest = []
			source.connect(this.analyser);
			this.analyser.connect(this.audioCtx.destination);


			
			// source.mediaElement.onloadedmetadata = e => {
			// 	console.log('source.mediaElement, loadedmetadata')
			// 	console.log('source.mediaElement.duration:', source.mediaElement.duration)
			// 	this.audioBuffer = this.audioCtx.createBuffer(
			// 		source.channelCount, 
			// 		source.mediaElement.duration * (this.audioCtx.sampleRate * source.channelCount), 
			// 		this.audioCtx.sampleRate
			// 	)
			// 	console.log('audioBuffer:', this.audioBuffer)

			// 	for (let channel = 0; channel < this.audioBuffer.numberOfChannels; channel++) {
			// 		let nowBuffering = this.audioBuffer.getChannelData(channel);
			// 		console.log('nowBuffering:', nowBuffering)
			// 		for (let i = 0; i < this.audioBuffer.length; i++) {
			// 			// nowBuffering[i] = 
			// 		}
			// 	}
			// }

			
			axios({url: `http://localhost:5001/tmp/${this.props.recording.filename}`, responseType: "arraybuffer"})
			.then(response => {
				console.log('server response:', response)

				this.audioCtx.decodeAudioData(response.data, buffer => {
          var decodedAudioData = buffer.getChannelData(0);
          console.log('decodedAudioData:', decodedAudioData);

          // Bucketing algorithm from https://getstream.io/blog/generating-waveforms-for-podcasts-in-winds-2-0/
					const NUMBER_OF_BUCKETS = 100;
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
						buckets
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
		if (this.intervalID) clearInterval(this.intervalID);

		this.intervalID = setInterval(() => {
			console.log('current time:', this.audioCtx.currentTime())
		}, 1000)
	}

	renderBuckets(buckets) {
		console.log('renderBuckets, buckets:', buckets)
		const SPACE_BETWEEN_BARS = 0;
		return buckets.map((bucket, i) => {
			let bucketSVGWidth = 100.0 / buckets.length;
			let bucketSVGHeight = bucket * 100.0;

			return <rect
				key={i}
				x={ bucketSVGWidth * i + SPACE_BETWEEN_BARS / 2.0 }
				y={ (100 - bucketSVGHeight) / 2.0 }
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

	handlePlay = () => {
		console.log('play')
		this.audioCtx.play()
	}

	render() {
		const { recording, audioBuffer } = this.props;
		const { datauri } = this.state;
		// console.log('Workspace, props:', this.props)
		return (
			<Container>
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

				<div>
					<svg
						viewBox="0 0 100 100"
						className="waveform-container"
						preserveAspectRatio="none"
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
								fill: '#44bc75',
							}}
						/>
					</svg>
					<svg>
						<defs>
							<clipPath id="waveform-mask" ref={this.waveformMaskElement}>
							{this.state.buckets && this.renderBuckets(this.state.buckets)}
							</clipPath>
						</defs>
					</svg>
				</div>

				<div style={{
					display: 'flex',
					justifyContent: 'center',
					margin: 20,
				}}>
				{ datauri && <audio ref={this.audioElement} controls src={datauri} /> }
				</div>

				<div>
					<button onClick={() => this.handlePlay()}>Play</button>
				</div>

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