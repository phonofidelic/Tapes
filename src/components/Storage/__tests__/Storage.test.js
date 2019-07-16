import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { wait } from '@testing-library/dom'
import { Provider } from 'react-redux';

import { INITIAL_STATE } from 'reducers/storage.reducer';
import { store } from 'Root';
import { TEST_ID } from 'constants/testIds';
import Storage from 'components/Storage';

const renderComponent = () => render(
	<Provider store={store}>
		<Storage />
	</Provider>
)

describe('Storage', () => {
	it('should display its section name', () => {
		const { getByText } = renderComponent()

		expect(getByText('Storage')).toBeVisible()
	})
})