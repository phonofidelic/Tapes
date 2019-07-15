import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { wait } from '@testing-library/dom'

import { TEST_ID } from 'constants/testIds';
import RecorderControls from 'components/Recorder/RecorderControls';

describe('Recordercontrols', () => {
	it('should be visible with a monitor button and a "rec" button', async () => {
		const { getByText, getByTitle, getByTestId } = render(<RecorderControls />)

		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.CONTAINER)).toBeVisible()
		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.MONITOR_START)).toBeVisible()
		expect(getByText('rec')).toBeVisible()
		expect(getByTitle('Click to start monitor')).toBeVisible()
	})

	it('should have a "stop" button when recording', () => {
		const { getByText, getByTestId } = render(
			<RecorderControls isRecording={true} />
		)

		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.CONTAINER)).toBeVisible()
		expect(getByText('stop')).toBeVisible()
	})
})

