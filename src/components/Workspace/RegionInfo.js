import React, { useContext } from 'react';

import FormattedTime from 'components/FormattedTime';
import { ThemeContext } from 'theme.context';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    backgroundColor: '#d3d3d3',
    margin: '0 10px',
    minWidth: 180
  },
  selected: {
  	backgroundColor: '#fff',
  	margin: '0 10px',
  	minWidth: 180
  }
});

const RegionInfo = props => {
	const { 
		region,
		recording,
		selectedRegion,
		count,
		handleSelectRegion,
	} = props;

	const classes = useStyles();

	const theme = useContext(ThemeContext)

	return (
		<Card 
			className={
				selectedRegion.id === region.id ? 
					(classes.selected) 
					: 
					(classes.card)
			}
			theme={theme}	
		>
		<CardActionArea>
			<CardContent onClick={() => handleSelectRegion(region)}>
				<Typography noWrap>{recording.title} - Region #{count + 1}</Typography>
				<div>
					<Typography noWrap variant="caption">start: </Typography>
					{
			 			<FormattedTime
			 				time={region.start * 1000}
			 				display="inline"
			 				variant="caption"
			 				noWrap
			 			/>
			 		}
		 		</div>
		 		<div>
			 		<Typography noWrap variant="caption">end: </Typography>
			 		{
			 			<FormattedTime
			 				time={region.end * 1000}
			 				display="inline"
			 				variant="caption"
			 				noWrap
			 			/>
			 		}
		 		</div>
			</CardContent>
		</CardActionArea>
		<CardActions>
			<Button onClick={() => console.log('Card button clicked')}>
				Save Tape
			</Button>
		</CardActions>
		</Card>
	);
}

export default RegionInfo;