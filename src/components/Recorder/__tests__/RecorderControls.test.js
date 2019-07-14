import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { getByTestId } from '@testing-library/dom'

import { TEST_ID } from 'constants/testIds';
import RecorderControls from 'components/Recorder/RecorderControls';

describe('Recordercontrols', () => {
	it('should be visible with a monitor button and a "rec" button', () => {
		const { getByText, getByTestId } = render(
			<RecorderControls />
		)

		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.CONTAINER)).toBeVisible()
		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.MONITOR_START)).toBeVisible()
		expect(getByText('rec')).toBeVisible()

		// fireEvent.click(getByTestId('recorder-controls_rec-button'))
		// expect(getByTestId('recorder-controls_stop-button')).toHaveTextContent('stop')
	})

	it('should have a "stop" button when recording', () => {
		const { getByText, getByTestId } = render(
			<RecorderControls isRecording={true} />
		)

		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.CONTAINER)).toBeVisible()
		expect(getByText('stop')).toBeVisible()
	})
})

