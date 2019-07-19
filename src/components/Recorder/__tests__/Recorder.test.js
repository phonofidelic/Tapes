import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { wait } from '@testing-library/dom'
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { INITIAL_STATE as recorderInitState } from 'reducers/recorder.reducer';
import { INITIAL_STATE as settingdInitState } from 'reducers/settings.reducer';
import { store } from 'Root';
import { TEST_ID } from 'constants/testIds';
import Recorder from 'components/Recorder';

const renderComponent = () => render(
	<Provider store={store}>
		<Recorder />
	</Provider>
)


const renderMockedComponent = (mockStore) => render(
	<Provider store={mockStore}>
		<Recorder />
	</Provider>
)

describe('Recorder', () => {
	it('should be visible with a monitor button and a "rec" button', async () => {
		const { getByText, getByTitle, getByTestId } = renderComponent();
		
		expect(getByText('Recorder')).toBeVisible()
		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.CONTAINER)).toBeVisible()
		expect(getByTestId(TEST_ID.RECORDER.CONTROLS.MONITOR_START)).toBeVisible()
		expect(getByText('rec')).toBeVisible()
		expect(getByTitle('Click to start monitor')).toBeVisible()		
	})

	it('should show a warning when trying to record without a set save directory', () => {
		const { getByText } = renderComponent()
		
		fireEvent(
			getByText('rec'), 
			new MouseEvent('click', {
				bubbles: true,
    		cancelable: true,
			})
		)

		expect(getByText('Please select a save folder.')).toBeVisible()
	})

	it('shows a "Stop" button and a recording indicator when recording', () => {
		let recorderState = {
			...recorderInitState,
			isRecording: true
		}
		let settingsState = {
			...settingdInitState,
			saveDir: '/test'
		}

		let mockStore = createStore(
			combineReducers({
				recorder: () => recorderState,
				settings: () => settingsState
			})
		)

		const { getByText } = renderMockedComponent(mockStore)

		expect(getByText('stop')).toBeVisible()
		expect(getByText('RECORDING')).toBeVisible()
	})

	// TODO: mock out getUserMedia
	it('should call navigator.mediaDevices.getUserMedia when monitor button is clicked (TODO: mock out getUserMedia)', async () => {
		const { getByTestId } = renderComponent()
		navigator.mediaDevices = {
			getUserMedia: jest.fn()
		}

		fireEvent(
			getByTestId(TEST_ID.RECORDER.CONTROLS.MONITOR_START),
			new MouseEvent('click', {
				bubbles: true,
				cancelabe: true
			})
		)

		expect(navigator.mediaDevices.getUserMedia).toBeCalled()
		// expect(getByTestId(TEST_ID.RECORDER.CONTROLS.MONITOR_STOP)).toBeVisible()
	})
})