import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions/workspace.actions';
import styled from 'styled-components';

import {
	Container,
	Section,
	SectionTitle,
	SectionBody,
} from 'components/CommonUI';

import AudioBuffer from 'audio-buffer'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;



class Workspace extends Component {
	constructor(props) {
		super(props);

		this.state = {
			buckets: [],
			datauri: null,
		}

		const { id } = this.props.match.params;
		this.props.loadRecordingData(id)

		this.audioElement = createRef();
	}
	componentDidMount() {
		const { recording } = this.props;
		this.audioCtx = new (window.AudioContext || window.wobkitAudioContext)();
		this.analyser = this.audioCtx.createAnalyser();

		console.log('this.audioElement:', this.audioElement)
		if (this.audioElement.current) {
			const source = this.audioCtx.createMediaElementSource(this.audioElement.current)
			console.log('*** Created audio source')
		}

		ipcRenderer.on('wrk:audioBuffer', (e, audioBuffer) => {
			console.log('wrk:audioBuffer, audioBuffer:', audioBuffer)
			this.props.loadAudioBuffer(audioBuffer)

			this.setState({
				...this.state,
				datauri: audioBuffer
			})

			// this.audioCtx.decodeAudioData(audioBuffer, buffer => {
   //        const decodedAudioData = buffer.getChannelData(0);
   //        console.log('decodedAudioData"', decodedAudioData);
   //    });

			// // Bucketing algorithm from https://getstream.io/blog/generating-waveforms-for-podcasts-in-winds-2-0/
			// const NUMBER_OF_BUCKETS = 100;
			// let bucketDataSize = Math.floor(audioBuffer.length / NUMBER_OF_BUCKETS);
			// let buckets = [];
			// for (var i = 0; i < NUMBER_OF_BUCKETS; i++) {
			// 	let startingPoint = i * bucketDataSize;
			// 	// console.log('*** startingPoint:', startingPoint)
			// 	let endingPoint = i * bucketDataSize + bucketDataSize;
			// 	let max = 0;
			// 	for (var j = startingPoint; j < endingPoint; j++) {
			// 		// console.log('*** audioBuffer[j]:', audioBuffer[j])
			// 		if (audioBuffer[j] > max) {
			// 			max = audioBuffer[j];
			// 		}
			// 	}
			// 	let size = Math.abs(max);
			// 	console.log('*** max:', max)
			// 	buckets.push(size / 2)
			// }
			// console.log('buckets:', buckets)
			// this.setState({
			// 	...this.state,
			// 	buckets
			// })

			// this.source = this.audioCtx.createMediaStreamSource(audioBuffer);
			// this.source.connect(this.analyser);
			// this.analyser.connect(this.audioCtx.destination);

			
		})
	}

	render() {
		const { recording, audioBuffer } = this.props;
		const { datauri } = this.state;
		console.log('Workspace, props:', this.props)
		return (
			<Container>
				<SectionTitle variant="overline">Workspace - {recording && recording.title}</SectionTitle>
				<div style={{ margin: 20 }}>
				{this.state.buckets && 
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
				}
				<div style={{
					display: 'flex',
					justifyContent: 'center',
					margin: 20,
				}}>
				{ datauri && <audio ref={this.audioElement} controls src={datauri} /> }
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