import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

function ErrorMessage(props) {
	const handleClose = () => {
		props.dismissError();
	}

	const { 
		error, 
		open,
	} = props

	return (
		<Dialog 
			open={open}
			onClose={handleClose}
		>
			<DialogContent>
				<Typography>{error && error.message}</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleClose()}>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ErrorMessage;