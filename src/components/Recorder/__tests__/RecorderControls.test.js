import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { getByTestId } from '@testing-library/dom'

import RecorderControls, { ControllButton } from 'components/Recorder/RecorderControls';

describe('Recordercontrols', () => {
	it('should be visible', () => {
		let state = {
			isRecording: false,
			monitoring: false
		}

		const { getByTestId } = render(
			<RecorderControls
				isRecording={state.isRecording}
				monitoring={state.monitoring}
				handleStartRec={jest.fn()}        
        handleStopRec={jest.fn()}
        handleStartMonitor={jest.fn()}
        handleStopMonitor={jest.fn()}
        handleToggleMonitor={jest.fn()}
			/>
		)

		expect(getByTestId('recorder-controls_container')).toBeVisible()
		expect(getByTestId('recorder-controls_rec-button')).toHaveTextContent('rec')
	})
})