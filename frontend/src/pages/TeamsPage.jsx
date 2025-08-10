import React, { useEffect, useState } from 'react';
import AddTeamForm from '../components/AddTeamForm';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/teams");
      const data = await res.json();
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
    try {
      const res = await fetch(`http://localhost:3000/api/teams/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchTeams();
      } else {
        const data = await res.json();
        alert("❌ Error al eliminar equipo: " + data.error);
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
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
      const res = await fetch(`http://localhost:3000/api/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName }),
      });

      if (res.ok) {
        cancelEditing();
        fetchTeams();
      } else {
        const data = await res.json();
        alert("❌ Error al actualizar equipo: " + data.error);
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Página de Equipos</h1>

      <AddTeamForm onTeamCreated={handleTeamCreated} />

      <h2>Lista de Equipos</h2>

      {teams.length === 0 ? (
        <p>No hay equipos aún.</p>
      ) : (
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              {editingId === team.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(team.id)}>💾 Guardar</button>
                  <button onClick={cancelEditing}>❌ Cancelar</button>
                </>
              ) : (
                <>
                  🏀 {team.name}
                  <button onClick={() => startEditing(team.id, team.name)} style={{ marginLeft: '1rem' }}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(team.id)} style={{ marginLeft: '0.5rem' }}>
                    🗑 Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamsPage;
