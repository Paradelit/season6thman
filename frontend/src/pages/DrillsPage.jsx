import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, ListGroup, Card } from 'react-bootstrap';

const DrillsPage = () => {
  const [drills, setDrills] = useState([]);
  const [newDrill, setNewDrill] = useState({ name: '', description: '' });
  const [editingDrill, setEditingDrill] = useState(null);

  useEffect(() => {
    fetchDrills();
  }, []);

  const fetchDrills = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/drills');
      setDrills(response.data);
    } catch (error) {
      console.error('Error fetching drills:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingDrill) {
      setEditingDrill({ ...editingDrill, [name]: value });
    } else {
      setNewDrill({ ...newDrill, [name]: value });
    }
  };

  const handleAddDrill = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/drills', newDrill);
      setNewDrill({ name: '', description: '' });
      fetchDrills();
    } catch (error) {
      console.error('Error adding drill:', error);
    }
  };

  const handleDeleteDrill = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/drills/${id}`);
      fetchDrills();
    } catch (error) {
      console.error('Error deleting drill:', error);
    }
  };

  const handleEditClick = (drill) => {
    setEditingDrill(drill);
  };

  const handleCancelEdit = () => {
    setEditingDrill(null);
  };

  const handleUpdateDrill = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/drills/${editingDrill.id}`, editingDrill);
      setEditingDrill(null);
      fetchDrills();
    } catch (error) {
      console.error('Error updating drill:', error);
    }
  };

return (
<Container className="mt-4">
<h1>Gestión de Ejercicios (Drills)</h1>

<Row className="mt-4">
<Col md={5} className="mb-4"> {/* Columna para el formulario */}
<Card>
<Card.Body>
<Card.Title>{editingDrill ? 'Editar Ejercicio' : 'Agregar Nuevo Ejercicio'}</Card.Title>
<Form onSubmit={editingDrill ? handleUpdateDrill : handleAddDrill}>
<Form.Group className="mb-3" controlId="formDrillName">
<Form.Label>Nombre del Ejercicio</Form.Label>
<Form.Control
type="text"
placeholder="Introduce el nombre del ejercicio"
name="name"
value={editingDrill ? editingDrill.name : newDrill.name}
onChange={handleInputChange}
required
/>
</Form.Group>
<Form.Group className="mb-3" controlId="formDrillDescription">
<Form.Label>Descripción</Form.Label>
<Form.Control
as="textarea"
rows={3}
placeholder="Introduce la descripción del ejercicio"
name="description"
value={editingDrill ? editingDrill.description : newDrill.description}
onChange={handleInputChange}
/>
</Form.Group>
{editingDrill ? (
<>
<Button variant="primary" type="submit" className="me-2">Actualizar Ejercicio</Button>
<Button variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>
</>
) : (
<Button variant="primary" type="submit">Agregar Ejercicio</Button>
)}
</Form>
</Card.Body>
</Card>
</Col>

<Col md={7}> {/* Columna para la lista */}
<Card>
<Card.Body>
<Card.Title>Listado de Ejercicios</Card.Title>
<ListGroup>
{drills.map((drill) => (
<ListGroup.Item key={drill.id} className="d-flex justify-content-between align-items-center">
<div>
<h5>{drill.name}</h5>
<p>{drill.description}</p>
</div>
<div>
<Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(drill)}>Editar</Button>
<Button variant="danger" size="sm" onClick={() => handleDeleteDrill(drill.id)}>Eliminar</Button>
</div>
</ListGroup.Item>
))}
</ListGroup>
</Card.Body>
</Card>
</Col>
</Row>
</Container>
);
};

export default DrillsPage;