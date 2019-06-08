import React, { Component, createRef } from 'react';
import Wad from 'web-audio-daw';

class Monitor extends Component {
	constructor(props) {
		super(props);

		this.ref = createRef();
		this.monitor = new Wad({
			src: 'mic'
		});
	}

	coponentDidMount() {
		this.play = this.props.monitor; // Bool
		this.play ? this.start() : this.stop()
	}

	start() {
		this.monitor.start();
	}

	stop() {
		this.monitor.stop();
	}

	render() {
		const { monitor } = this.props;
		return <div ref={this.ref} />
	}
}

export default Monitor;