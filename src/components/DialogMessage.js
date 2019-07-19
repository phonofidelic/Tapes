import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

function DialogMessage(props) {
	const {
		title,
		message, 
		open,
		actionButtonText,
		cancelButtonText,
		handleAction,
		handleClose,
	} = props

	return (
		<Dialog 
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<Typography>{message}</Typography>
			</DialogContent>
			<DialogActions>
				{ handleAction &&
					<Button onClick={() => handleAction()}>
						{actionButtonText}
					</Button>
				}
				{ handleClose &&
					<Button 
						style={{color: 'red'}} 
						onClick={() => handleClose()}
					>
						{cancelButtonText}
					</Button>
				}
			</DialogActions>
		</Dialog>
	)
}

export default DialogMessage;