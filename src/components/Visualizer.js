import React, { Component } from 'react'

class Visualizer extends Component {
	constructor(props) {
		super(props)
		this.visRef = React.createRef();
	}
	render() {
		return (
			<div>
				<h1>Visualizer</h1>
				<canvas ref={this.visRef} /> 
			</div>
		);	
	}
}

export default Visualizer;