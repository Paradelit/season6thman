import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">Web Season6thman</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Inicio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/teams">
              <Nav.Link>Equipos</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/players">
              <Nav.Link>Jugadores</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/drills">
              <Nav.Link>Ejercicios</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/workouts">
              <Nav.Link>Entrenamientos</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;