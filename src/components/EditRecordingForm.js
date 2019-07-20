import React from 'react';
import { Field, reduxForm } from 'redux-form'

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';


const EditRecordingForm = props => {
	const { 
		recording,
		setEditMode,
		showActionButtons,
		handleSubmit,
		handleEditSubmit,
	} = props;

	const form = reduxForm({
		form: 'recording'
	});

	const renderField = ({ 
		input,
		label,
		meta: { touched, invalid, error },
		...custom
	}) => (
		<TextField
			label={label}
			{...input}
			{...custom}
			

		/>
	)

	return (
		<form 
			style={{ width: '100%', display: 'flex' }}
			onSubmit={handleSubmit(formData => {
				setEditMode(false)
				console.log(formData)
				handleEditSubmit(formData)
			})}
		>
			<span style={{ width: '100%' }}>
			<Field
				style={{ width: '100%' }}
				component={renderField}
				id={`recording-title-input_${recording.id}`}
				name={`title`}
				type="text"
				placeholder={recording.title}
				label="Title"
				autoFocus={true}
				required={props.titleRequired}
			/>
			</span>
			{ showActionButtons &&
				<span style={{ width: '50px' }}>
					<Tooltip
						title="Cancel changes"
						placement="left"
						enterDelay={300}
					>
						<IconButton
							aria-haspopup="true"
							onClick={() => setEditMode(false)}
						>
							<CloseIcon />
						</IconButton>
					</Tooltip>
					<Tooltip
						title="Save changes"
						placement="left"
						enterDelay={300}
					>
						<IconButton
							aria-haspopup="true"
							type="submit"
						>
							<CheckIcon />
						</IconButton>
					</Tooltip>
				</span>
			}
		</form>
	);
}

export default reduxForm({ form: 'recording' })(EditRecordingForm);