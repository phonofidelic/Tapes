import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import { wait } from '@testing-library/dom'

import { TEST_ID } from 'constants/testIds';
import { Recorder } from 'components/Recorder';

describe('Recorder', () => {
	it('should render', () => {
		const { getByText } = render(<Recorder />)

		expect(getByText(Recorder)).toBeVisivle()
	})
})