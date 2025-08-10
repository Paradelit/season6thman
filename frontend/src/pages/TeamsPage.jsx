import React from 'react';
import { useEffect, useState } from 'react';
import AddTeamForm from '../components/AddTeamForm';
import axios from 'axios';
import { Container, Row, Col, Button, Form, ListGroup, Card } from 'react-bootstrap';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/teams");
      const data = response.data;
      setTeams(data);
    } catch (err) {
      console.error("Error al cargar equipos:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTeamCreated = () => {
    fetchTeams();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      try {
        await axios.delete(`http://localhost:3000/api/teams/${id}`);
        fetchTeams(); 
      } catch (err) {
        console.error("Error al eliminar equipo:", err);
      }
    }
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/teams/${id}`, { name: editingName });
      cancelEditing();
      fetchTeams(); // Refresh the list
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Página de Equipos</h1>
      <Container className="mt-4">
        <Row className="mt-4">
          {/* Formulario de agregar/editar */}
          <Col md={5} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{editingId ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}</Card.Title>
                {editingId ? (
                  <Form onSubmit={(e) => { e.preventDefault(); handleUpdate(editingId); }}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="me-2">
                      Guardar
                    </Button>
                    <Button variant="secondary" onClick={cancelEditing}>
                      Cancelar
                    </Button>
                  </Form>
                ) : (
                  <AddTeamForm onTeamCreated={handleTeamCreated} />
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Lista de equipos */}
          <Col md={7}>
            <Card>
              <Card.Body>
                <Card.Title>Lista de Equipos</Card.Title>
                {teams.length === 0 ? (
                  <p>No hay equipos aún.</p>
                ) : (
                  <ListGroup>
                    {teams.map((team) => (
                      <ListGroup.Item key={team.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          🏀 {team.name}
                        </div>
                        <div>
                          <Button variant="warning" size="sm" className="me-2" onClick={() => startEditing(team.id, team.name)}>
                            ✏️ Editar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(team.id)}>
                            🗑 Eliminar
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TeamsPage;