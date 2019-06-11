import React, { Component, useState } from 'react';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import ListItem from '@material-ui/core/ListItem';

export default function(props) {
	const { recording, handleDeleteRecording } = props;
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = e => {
		setAnchorEl(e.currentTarget);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const handleClickDelete = (id, path) => {
		console.log('handleClickDelete, path:', path)
		setAnchorEl(null)

		// TODO: implement action confirmation flow.
		handleDeleteRecording(id, path)
	}

	return (
		<ListItem 
			key={recording.id} 
			style={{ justifyContent: 'space-between' }}
			divider
			button
			disableRipple	
		>
			<span>{recording.title}</span>
			<span style={{ width: '50px' }}>
				<Menu
					id={`${recording.id}_menu`}
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
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