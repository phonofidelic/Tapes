import React, { Component } from 'react';

import FormattedTime from 'components/FormattedTime'

// Adapted from: https://medium.com/@peterjd42/building-timers-in-react-stopwatch-and-countdown-bc06486560a2
class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timerOn: false,
			time: props.time || 0,
			start: 0,
		}
	}

	componentDidMount() {
		this.startTimer();
	}

	componentWillUnmount() {
		if (this.timer) clearInterval(this.timer)
	}

	startTimer = () => {
		this.setState({
			time: this.state.time,
			timerOn: true,
			start: Date.now() - this.state.time,
		});

		this.timer = setInterval(() => this.setState({
			time: Date.now() - this.state.start,
		}), 10);
	}

	stopTimer = () => {
		this.setState({ timerOn: false });
		clearInterval(this.timer);
	}

	resetTimer = () => {
		this.setState({
			time: 0,
			start: 0,
		});
	}

	render() {
		const { time } = this.state;
		
		return <FormattedTime time={time} />;
	}
}

export default Timer;