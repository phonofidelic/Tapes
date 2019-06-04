import React, { Component } from 'react';
import Waveform from 'audio-waveform';
// import BrowserMic from 'utils/BrowserMic';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;
const { Transform } = window.require('stream');

const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 300;

class Visualizer extends Component {
	constructor(props) {
		super(props)
		this.canvasElement = React.createRef();

		this.visualizer = new Transform({
			transform(chunk, encoding, callback) {
				callback(null, chunk)
			}
		})

		this.ctxWidth = CANVAS_WIDTH;
		this.ctxHeight = CANVAS_HEIGHT;
	}

	componentDidMount() {
		const plotter = new Waveform({
		    //what channel to display, 0 - L, 1 - R
		    channel: 0,
		 
		    //size of a sliding window to display, number of samples
		    size: 1024,
		 
		    //offset of a window to display, if undefined - the last piece of data is shown
		    offset: undefined,
		 
		    //how often to update display (node only)
		    framesPerSecond: 20,
		 
		    //line or point draw style
		    line: true,
		 
		    //size of a waveform data to store
		    bufferSize: 44100,
		 
		    //canvas element to render (optional)
		    canvas: document.querySelector('#canvas')
		 
		    //...pcm-format options, see pcm-util below
		});

		const ctx = document.querySelector('#canvas').getContext('2d');
		console.log('ctx:', ctx)


		let data;
		ipcRenderer.on('monitor:bufferdata', this.handleBufferData);
		
		this.visualizer.pipe(plotter);
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('monitor:bufferdata', this.handleBufferData);
	}

	handleBufferData = (e, buffer) => {
		// Write data to plotter
		this.visualizer.write(buffer);
	}

	render() {
		return (
			<div>
				{/*<h1>Visualizer</h1>*/}
				<canvas id="canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={this.canvasElement} /> 
			</div>
		);	
	}
}

export default Visualizer;
