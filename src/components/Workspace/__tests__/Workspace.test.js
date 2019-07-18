import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { wait } from '@testing-library/dom'
import { Provider } from 'react-redux';

import { INITIAL_STATE } from 'reducers/workspace.reducer';
import { store } from 'Root';
import { TEST_ID } from 'constants/testIds';
import Workspace from 'components/Workspace';

const mockRecording = {
	title: 'test'
}

const renderComponent = () => render(
	<Provider store={store}>
		<Workspace recording={mockRecording} />
	</Provider>
)

window.AudioContext = jest.fn().mockImplementation(() => {
  return {
  	createAnalyser: jest.fn()
  }
});

describe('Workspace', () => {
	it('should show a section title and playback controls', () => {
		const { getByText, getByTestId } = renderComponent()	
		expect(getByText('Workspace -')).toBeVisible()
		expect(getByTestId(TEST_ID.WORKSPACE.CONTROLS.CONTAINER)).toBeVisible()
	})

	// it('should have waveform and timeline elements', () => {
	// 	const { getByTestId } = renderComponent()

	// 	expect(getByTestId(TEST_ID.WORKSPACE.TRACK.TIMELINE)).toBeVisible()
	// 	expect(getByTestId(TEST_ID.WORKSPACE.TRACK.WAVEFORM)).toBeVisible()
	// })
})