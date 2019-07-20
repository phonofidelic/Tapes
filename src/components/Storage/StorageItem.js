import React, { Fragment, useState, useContext } from 'react';
import { ThemeContext } from 'theme.context';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenIcon from '@material-ui/icons/Launch';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';

import EditRecordingForm from 'components/EditRecordingForm';

export default function StorageItem(props) {
	const { 
		recording,
		selectedRecording,
		handleDeleteRecording,
		handleOpenRecording,
		handleSelectRecording,
	} = props;

	const [anchorEl, setAnchorEl] = useState(null);
	const [editMode, setEditMode] = useState(false);

	const theme = useContext(ThemeContext)

	const handleClick = e => {
		setAnchorEl(e.currentTarget);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const handleClickOpen = (recording) => {
		setAnchorEl(null);
		handleOpenRecording(recording);
	}

	const handleClickEdit = id => {
		setAnchorEl(null);
		setEditMode(!editMode);
	}

	const handleClickDelete = (id, path) => {
		setAnchorEl(null);

		// TODO: implement action confirmation flow.
		handleDeleteRecording(id, path);
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
			style={{ 
				justifyContent: 'space-between',
				// backgroundColor: theme.palette.secondary.light,
			}}
			key={recording.id} 
			selected={selectedRecording === recording.id}
			divider
			button
			disableRipple	
			onClick={() => handleSelectRecording(recording.id)}
		>
		{ !editMode ?
			<Fragment>
				<span style={{ 
					width: '100%', 
					// borderBottom: `4px solid ${theme.palette.primary.accent}` ,
					// paddingBottom: 5
				}}>
					{ recording.title }
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
							key="open"
							onClick={() => handleClickOpen(recording)}
						>
							<OpenIcon style={{ marginRight: 10 }}/> Open
						</MenuItem>
						<MenuItem 
							key="edit"
							onClick={() => handleClickEdit(recording.id)}
						>
							<EditIcon style={{ marginRight: 10 }}/> Edit title
						</MenuItem>
						<MenuItem 
							key="delete"
							style={{
								color: 'red'
							}}
							onClick={() => handleClickDelete(recording.id, recording.src)}
						>
							<DeleteIcon style={{ marginRight: 10 }}/> DELETE
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
			</Fragment>
			:
			<EditRecordingForm 
				titleRequired={true}
				recording={recording}
				showActionButtons={true}
				setEditMode={setEditMode}
				handleEditSubmit={handleEditSubmit}
			/>
		}
		</ListItem>
	);
}