import React from 'react';

const Recorder = props => {
	const {
		onStartRec,
		onStopRec
	} = props;
	return (
		<div>
			<button onClick={() => onStartRec()}>rec</button>
      <button onClick={() => onStopRec()}>stop</button>
		</div>
	);
}

export default Recorder;