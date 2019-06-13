import React from 'react';
import { Field, reduxForm } from 'redux-form'

import TextField from '@material-ui/core/TextField';



const EditRecordingForm = props => {
	const { 
		recording,
		setEditMode,
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
		<form onSubmit={handleSubmit(formData => {
			setEditMode(false)
			console.log(formData)
			handleEditSubmit(formData)
		})}
		style={{width: '100%'}}
		>
			<Field
				component={renderField}
				style={{width: '100%'}}
				id={`recording-title-input_${recording.id}`}
				name={`title`}
				type="text"
				placeholder="Title"
				label={recording.title}
				autoFocus={true}
			/>
		</form>
	);
}

export default reduxForm({ form: 'recording' })(EditRecordingForm);