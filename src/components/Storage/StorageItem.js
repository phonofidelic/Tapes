import React, { Component, useState } from 'react';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';

import EditRecordingForm from 'components/Storage/EditRecordingForm';

export default function(props) {
	const { recording, handleDeleteRecording } = props;
	const [anchorEl, setAnchorEl] = useState(null);
	const [editMode, setEditMode] = useState(false);

	const handleClick = e => {
		setAnchorEl(e.currentTarget);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const handleClickEdit = id => {
		setAnchorEl(null)
		setEditMode(!editMode)
	}

	const handleClickDelete = (id, path) => {
		setAnchorEl(null)

		// TODO: implement action confirmation flow.
		handleDeleteRecording(id, path)
	}

	const handleEditSubmit = (formData) => {
		const { recording } = props;
		setEditMode(!editMode)
		formData.id = recording.id;
		console.log('handleSubmit, formData:', formData);
		props.handleEditRecording(formData)
	}

	return (
		<ListItem 
			key={recording.id} 
			style={{ justifyContent: 'space-between' }}
			divider
			button
			disableRipple	
		>
			<span style={{ width: '100%' }}>
			{ !editMode ? 
				recording.title 
				: 
				<EditRecordingForm 
					recording={recording}
					setEditMode={setEditMode}
					handleEditSubmit={handleEditSubmit}
				/>
			}
			</span>
			<span style={{ width: '50px' }}>
				<Menu
					id={`${recording.id}_menu`}
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem 
						key="edit"
						onClick={() => handleClickEdit(recording.id)}
					>
						Edit title
					</MenuItem>
					<MenuItem 
						key="delete"
						style={{
							color: 'red'
						}}
						onClick={() => handleClickDelete(recording.id, recording.src)}
					>
						DELETE
					</MenuItem>
				</Menu>
				<IconButton
					aria-controls={`${recording.id}_menu`}
					aria-haspopup="true"
					onClick={handleClick}
				>
					<MoreVertIcon />
				</IconButton>
			</span>
		</ListItem>
	);
}