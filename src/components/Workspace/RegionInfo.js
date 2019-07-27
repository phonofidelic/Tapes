import React, { useContext } from 'react';
import styled from 'styled-components';

import FormattedTime from 'components/FormattedTime';
import { ThemeContext } from 'theme.context';

import Typography from '@material-ui/core/Typography';


const Container = styled.div`
	// border: 1px solid ${({theme}) => theme.palette.primary.accent};
	background-color: ${ props => props.selectedRegion.id === props.regionId ? '#d3d3d3' : 'none'};
	padding: 5px;
	border-radius: 3px;
	margin: 0 10px;
	// max-height: 54px;
	// min-width: 150px;
`

const RegionInfo = props => {
	const { 
		region,
		selectedRegion,
		count,
		handleSelectRegion,
	} = props;

	const theme = useContext(ThemeContext)

	return (
		<Container 
			theme={theme}
			selectedRegion={selectedRegion}
			regionId={region.id}
			onClick={() => handleSelectRegion(region)}
		>
			<div>Region #{count + 1}</div>
			<div>
				<Typography variant="caption">start: </Typography>
			{
				<FormattedTime
					time={region.start * 1000}
					display="inline"
					variant="caption"
				/>
			}
			</div>
			<div>
			<Typography variant="caption">end: </Typography>
			{
				<FormattedTime
					time={region.end * 1000}
					display="inline"
					variant="caption"
				/>
			}
			</div>
		</Container>
	)
}

export default RegionInfo;