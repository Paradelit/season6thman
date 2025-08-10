import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, ListGroup, Card } from 'react-bootstrap';

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [drills, setDrills] = useState([]); // To store available drills
  const [newWorkout, setNewWorkout] = useState({ name: '', date: '', drillIds: [] });

  useEffect(() => {
    fetchWorkouts();
    fetchDrills(); // Fetch drills when the component mounts
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

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
    setNewWorkout({ ...newWorkout, [name]: value });
  };

  const handleDrillSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setNewWorkout({ ...newWorkout, drillIds: selectedOptions });
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/workouts', newWorkout);
      setNewWorkout({ name: '', date: '', drillIds: [] });
      fetchWorkouts(); // Refresh the list after adding
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h1>Gestión de Entrenamientos (Workouts)</h1>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Agregar Nuevo Entrenamiento</Card.Title>
              <Form onSubmit={handleAddWorkout}>
                <Form.Group className="mb-3" controlId="formWorkoutName">
                  <Form.Label>Nombre del Entrenamiento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Introduce el nombre del entrenamiento"
                    name="name"
                    value={newWorkout.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formWorkoutDate">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newWorkout.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formWorkoutDrills">
                  <Form.Label>Ejercicios</Form.Label>
                  <Form.Control
                    as="select"
                    multiple
                    name="drillIds"
                    value={newWorkout.drillIds}
                    onChange={handleDrillSelect}
                  >
                    {drills.map(drill => (
                      <option key={drill.id} value={drill.id}>{drill.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Agregar Entrenamiento
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>Listado de Entrenamientos</h2>
          <ListGroup>
            {workouts.map((workout) => (
              <ListGroup.Item key={workout.id}>
                <h5>{workout.name} - {workout.date}</h5>
                <p>Ejercicios IDs: {workout.drillIds.join(', ')}</p> {/* Displaying IDs for now */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkoutsPage;