import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	width: 100%;
`

const Button = styled.button`
	width: 100%;
	height: 50px;
`

const Header = props => {
	return (
		<nav>
			<Container>
				<Link to="/">
					<Button>Recorder</Button>
				</Link>
				<Link to="/settings">
					<Button>Settings</Button>
				</Link>
			</Container>
		</nav>
	)
}

export default Header;