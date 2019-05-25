import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	width: 100%;
`
const Header = props => {
	return (
		<nav>
			<Container>
			<Link to="/">
					Recorder
				</Link>
				<Link to="/settings">
					Settings
				</Link>
			</Container>
		</nav>
	)
}

export default Header;