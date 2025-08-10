import React, { useEffect, useState } from 'react';
import AddPlayerForm from '../components/AddPlayerForm';
import axios from 'axios';
import { Container, Row, Col, Button, Form, ListGroup, Card } from 'react-bootstrap';
const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', position: '', teamId: '' });

  // Obtener equipos para el select
  const fetchTeams = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/teams');
      const data = res.data;
      setTeams(data);
    } catch (err) {
      console.error('Error al cargar equipos:', err);
    }
  };

  // Obtener jugadores
  const fetchPlayers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/players');
      const data = res.data;
      setPlayers(data);
    } catch (err) {
      console.error('Error al cargar jugadores:', err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const handlePlayerCreated = () => {
    fetchPlayers();
  };

  const startEditing = (player) => {
    setEditingId(player.id);
    setEditingData({
      name: player.name,
      position: player.position || '',
      teamId: player.teamId,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({ name: '', position: '', teamId: '' });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/players/${id}`, editingData);
      cancelEditing();
      fetchPlayers();
    } catch (error) {
      console.error('Error al actualizar jugador:', error);
      alert('❌ Error al actualizar jugador: ' + (error.response?.data?.error || error.message));
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/players/${id}`);
      if (res.status === 200) { // Axios uses status codes directly
 fetchPlayers();
      }
    } catch (err) {
      console.error('Error al eliminar jugador:', err);
    }
  };

  return (
    <Container className="mt-4">
      <h1>Jugadores</h1>

      <Row className="mt-4">
        {/* Columna para el formulario de Agregar/Editar */}
        <Col md={5} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{editingId ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}</Card.Title>
              {/* Aquí integramos el formulario. Podríamos mover la lógica del formulario aquí
                  o seguir usando el componente AddPlayerForm y adaptarlo para la edición si es necesario.
                  Por ahora, mantendremos AddPlayerForm para agregar y crearemos un formulario similar para editar.
                  Una mejor aproximación sería tener un solo componente FormularioJugador reusable. */}

              {/* Si no estamos editando, mostramos el formulario de agregar */}
              {!editingId && <AddPlayerForm teams={teams} onPlayerCreated={fetchPlayers} />}

              {/* Si estamos editando, mostramos el formulario de edición */}
              {editingId && (
                <Form onSubmit={() => handleUpdate(editingId)}>
                   <Form.Group className="mb-3" controlId="formPlayerName">
                    <Form.Label>Nombre del Jugador</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingData.name}
                      onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                   <Form.Group className="mb-3" controlId="formPlayerPosition">
                    <Form.Label>Posición</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Posición"
                      value={editingData.position}
                      onChange={(e) => setEditingData({ ...editingData, position: e.target.value })}
                    />
                   </Form.Group>
                   <Form.Group className="mb-3" controlId="formPlayerTeam">
                    <Form.Label>Equipo</Form.Label>
                    <Form.Control
                      as="select"
                      value={editingData.teamId}
                      onChange={(e) => setEditingData({ ...editingData, teamId: e.target.value })}
                      required
                    >
                      <option value="">Selecciona un equipo</option> {/* Opción por defecto */}
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </Form.Control>
                   </Form.Group>
                   <Button variant="primary" type="submit" className="me-2">💾 Guardar</Button>
                   <Button variant="secondary" onClick={cancelEditing}>❌ Cancelar</Button>
                </Form>
              )}

            </Card.Body>
          </Card>
        </Col>

        {/* Columna para la lista de Jugadores */}
        <Col md={7}>
          <Card>
            <Card.Body>
              <Card.Title>Lista de Jugadores</Card.Title>

              {players.length === 0 ? (
                <p>No hay jugadores aún.</p>
              ) : (
                <ListGroup>
                  {players.map((player) => (
                    <ListGroup.Item key={player.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>🏀 {player.name} ({player.position || "Sin posición"})</h5>
                        <p>Equipo: {teams.find((t) => t.id === player.teamId)?.name || "Desconocido"}</p>
                      </div>
                      <div>
                         <Button variant="warning" size="sm" className="me-2" onClick={() => startEditing(player)}>
                          ✏️ Editar
                         </Button>
                         <Button variant="danger" size="sm" onClick={() => handleDelete(player.id)}>
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
  );
};

export default PlayersPage;
