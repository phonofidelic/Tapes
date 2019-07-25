import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	text-align: left;
`

export const Section = styled.div`

`

export const SectionTitle = styled(Typography)`
	color: #fff;
	background-color: #333;
	display: flex;
	padding-left: 8px;
	z-index: 4;
`
// const SectionSubTitle = 
export const SectionSubTitle = styled(Typography)`
	color: #fff;
	background-color: #666;
	display: flex;
	padding-left: 8px;
	height: 19px;
	line-height: 19px;
`

export const SectionBody = styled.div`
	padding: 8px;
`

