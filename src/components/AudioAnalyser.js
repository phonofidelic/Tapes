/***
 *	From: https://www.twilio.com/blog/audio-visualisation-web-audio-api--react
 */
import React, { Component } from 'react';
import AudioVisualiser from 'components/AudioVisualiser';

class AudioAnalyser extends Component {
	constructor(props) {
		super(props);
		this.state = { audioData: new Uint8Array(0) };
	}

	componentDidMount() {
		const { audio } = this.props;
		this.audioCtx = new (window.AudioContext || window.wobkitAudioContext)();
		this.analyser = this.audioCtx.createAnalyser();
		this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
		this.source = this.audioCtx.createMediaStreamSource(audio);
		this.source.connect(this.analyser);
		this.analyser.connect(this.audioCtx.destination);
		this.rafId = requestAnimationFrame(this.tick);
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.rafId);
		this.audioCtx.destination.disconnect();
		this.analyser.disconnect();
		this.source.disconnect();
	}

	tick = () => {
		this.analyser.getByteTimeDomainData(this.dataArray);
		this.setState({ audioData: this.dataArray });
		this.rafId = requestAnimationFrame(this.tick);
	}

	render() {
		return (
			<AudioVisualiser audioData={this.state.audioData} />
		);
	}
}

export default AudioAnalyser;
