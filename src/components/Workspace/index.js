import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

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
			// buckets: [],
			chanelCount: null,
			audioTime: 0,
			audioTimePercent: 0,
			audioDuration: 0,
			playing: false,
		}

		// const { id } = this.props.match.params;
		let params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		this.props.loadRecordingData(id)

		this.audioElement = createRef();
		this.waveformMaskElements = [createRef() ,createRef()];

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

		this.timeMetrics = []
		// timeMetrics.length = Math.ceil(this.audioDuration / 1000)
		console.log('e.target.duration:', e.target.duration)
		console.log('window.innerWidth:', window.innerWidth/ e.target.duration)
		// for (let i = 0; i < this.audioDuration; i++) {
		// 	this.timeMetrics.push({i})
		// }
		// console.log('this.timeMetrics:', this.timeMetrics)
		
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
		const { recording } = this.props;
		const chanelCount = parseInt(recording.format.chanels, 10);		

		// TODO: use audio element as source, no need to request same resource twice
		axios({url: `http://localhost:5000/recordings/${recording.filename}`, responseType: "arraybuffer"})
			.then(response => {
				console.log('server response:', response)

				this.audioCtx.decodeAudioData(response.data, buffer => {
					let chanels = []
					for (let c = 0; c < chanelCount; c++) {
	          var decodedAudioData = buffer.getChannelData(c);
	          // console.log('decodedAudioData:', decodedAudioData);

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
						// console.log('buckets:', buckets)

						// this.setState({
						// 	...this.state,
						// 	buckets,
						// })
						chanels.push(buckets)
					} // *** End for-loop ***
					console.log('chanels:', chanels)
					this.setState({
						chanels: chanels
					})
					console.log('this.state.chanels:', this.state.chanels)
	      }, err => console.error('decodeAudioData error:', err));
			})
			.catch(err => console.error('server error:', err));
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

	handleProgressClick = (e) => {
		// Get time position from click X pos
		const time = (e.clientX / window.innerWidth) * this.state.audioDuration;
		// console.log(time)
		this.source.mediaElement.currentTime = time;

		// Play audio from new position
		this.source.mediaElement.play();
		clearInterval(this.intervalID);
		this.startTimer();
		this.setState({ playing: true });
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

					<div style={{
						// border: 'solid red 1px',
					}}>
						{ this.state.chanels && this.state.chanels.map((chanel, i) => (
							<svg
								key={i}
								viewBox={`0 0 100 50`}
								width="100%"
								height={`${400 / this.state.chanels.length}px`}
								className="waveform-container"
								preserveAspectRatio="none"
								onClick={this.handleProgressClick}
							>
								<line
									x1={this.state.audioTimePercent - .1}
									y1="0"
									x2={this.state.audioTimePercent - .1}
									y2={`${400 / this.state.chanels.length}px`}
									stroke={theme.palette.primary.accent}
									strokeWidth="0.1"
								/>
								{/*
								<rect 
									className="waveform-time"
									x="0"
									y="0"
									width="100%"
									height={`${1 * this.state.chanels.length}px`}
									fill="#666"
									style={{
										background: 'red'
									}}
								/>
								*/}
								<svg
									viewBox={'0 0 100 100'}
									width="100%"
									height={`${1 * this.state.chanels.length}px`}
									preserveAspectRatio="none"
								>
									<rect 
										className="waveform-time"
										x="0"
										y="0"
										width="100%"
										height="100"
										fill="#666"
									/>
									{	chanel.map((bucket, i) => (	// <- Wrong metrics, needs to somhow map over duration?
										<line
											key={i}
											x1={i}
											y1="50"
											x2={i}
											y2="100"
											stroke="#fff"
											strokeWidth="0.1"
										/>
									))

									}
								</svg>
								<rect 
									className="waveform-bg"
									x="0"
									y="0"
									width="100"
									height="100"
									style={{
										clipPath: `url(#waveform-mask-chanel-${i})`,
										fill: 'lightgray',
									}}
								/>
								<rect
									className="waveform-progress"
									width={this.state.audioTimePercent}
									height="100"
									style={{
										clipPath: `url(#waveform-mask-chanel-${i})`,
										fill: theme.palette.primary.accent,
									}}
								/>
							</svg>
						))}
						

						{ this.state.chanels && this.state.chanels.map((buckets, i) => (
							<svg
								key={i} 
								style={{
									height: 0
								}}
							>
								<defs>
									<clipPath id={`waveform-mask-chanel-${i}`} ref={this.waveformMaskElements[i]}>
									{ this.renderBuckets(buckets) }
									</clipPath>
								</defs>
							</svg>
						))}
						
					</div>

					{ recording && 
						<audio 
							ref={this.audioElement}
							//controls
							preload="true"
							crossOrigin="anonymous"
							src={`http://localhost:5000/recordings/${recording.filename}`}
							//src={`file://${recording.src}`}
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