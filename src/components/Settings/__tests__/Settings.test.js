import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { wait } from '@testing-library/dom'
import { Provider } from 'react-redux';

import { INITIAL_STATE } from 'reducers/settings.reducer';
import { store } from 'Root';
import { TEST_ID } from 'constants/testIds';
import Settings from 'components/Settings';

const renderComponent = () => render(
	<Provider store={store}>
		<Settings />
	</Provider>
)

describe('Settings', () => {
	it('should display its section name', () => {
		const { getByText } = renderComponent()

		expect(getByText('Settings')).toBeVisible()
	})

	it('should have a storage section', async () => {
		const { getByText } = renderComponent()

		expect(getByText('Storage')).toBeVisible()
		expect(getByText('Save folder: (not set)')).toBeVisible()
		expect(getByText('Set save folder')).toBeVisible()
	})

	it('should have a format section', () => {
		const { getByText } = renderComponent()

		expect(getByText('Format')).toBeVisible()
		expect(getByText('Select an audio format')).toBeVisible()
		expect(getByText('mp3')).toBeVisible()
		expect(getByText('Mono')).toBeVisible()
		expect(getByText('Stereo')).toBeVisible()
	})

	it('should have 4 diferent audio format options', () => {
		const { getByText } = renderComponent()
		
		fireEvent(
			getByText('mp3'),
			new MouseEvent('click', {
				bubbles: true,
    		cancelable: true,
			})
		)

		expect(getByText('flac')).toBeVisible()
		expect(getByText('ogg')).toBeVisible()
		expect(getByText('flac')).toBeVisible()
	})

	it('should have mono and stereo options', () => {
		const { getByText, getByLabelText, getByTestId } = renderComponent()

		expect(getByTestId(TEST_ID.SETTINGS.FORMAT.FORM)).toHaveFormValues({'channels': '1'})

		fireEvent(
			getByLabelText('Stereo'),
			new MouseEvent('click', {
				bubbles: true,
    		cancelable: true,
			})
		)

		expect(getByTestId(TEST_ID.SETTINGS.FORMAT.FORM)).toHaveFormValues({'channels': '2'})
	})
})
