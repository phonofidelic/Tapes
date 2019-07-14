import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { getByTestId } from '@testing-library/dom'

import RecorderControls from 'components/Recorder/RecorderControls';

describe('Recordercontrols', () => {
	it('should be visible with a "rec" button', () => {
		const { getByText, getByTestId } = render(
			<RecorderControls />
		)

		expect(getByTestId('recorder_controls_container')).toBeVisible()
		expect(getByText('rec')).toBeVisible()

		// fireEvent.click(getByTestId('recorder-controls_rec-button'))
		// expect(getByTestId('recorder-controls_stop-button')).toHaveTextContent('stop')
	})

	it('should have a "stop" button when recording', () => {
		const { getByText, getByTestId } = render(
			<RecorderControls isRecording={true} />
		)

		expect(getByTestId('recorder_controls_container')).toBeVisible()
		expect(getByText('stop')).toBeVisible()
	})
})

