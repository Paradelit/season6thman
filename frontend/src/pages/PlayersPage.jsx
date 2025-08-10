import React, { useEffect, useState } from 'react';
import AddPlayerForm from '../components/AddPlayerForm';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', position: '', teamId: '' });

  // Obtener equipos para el select
  const fetchTeams = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/teams');
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error('Error al cargar equipos:', err);
    }
  };

  // Obtener jugadores
  const fetchPlayers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/players');
      const data = await res.json();
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
      const res = await fetch(`http://localhost:3000/api/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData),
      });

      if (res.ok) {
        cancelEditing();
        fetchPlayers();
      } else {
        const data = await res.json();
        alert('❌ Error al actualizar jugador: ' + data.error);
      }
    } catch (err) {
      console.error('Error al actualizar jugador:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/players/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPlayers();
      } else {
        const data = await res.json();
        alert('❌ Error al eliminar jugador: ' + data.error);
      }
    } catch (err) {
      console.error('Error al eliminar jugador:', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Jugadores</h1>

      <AddPlayerForm teams={teams} onPlayerCreated={handlePlayerCreated} />

      <h2>Lista de Jugadores</h2>

      {players.length === 0 ? (
        <p>No hay jugadores aún.</p>
      ) : (
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {editingId === player.id ? (
                <>
                  <input
                    type="text"
                    value={editingData.name}
                    onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Posición"
                    value={editingData.position}
                    onChange={(e) => setEditingData({ ...editingData, position: e.target.value })}
                  />
                  <select
                    value={editingData.teamId}
                    onChange={(e) => setEditingData({ ...editingData, teamId: e.target.value })}
                    required
                  >
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleUpdate(player.id)}>💾 Guardar</button>
                  <button onClick={cancelEditing}>❌ Cancelar</button>
                </>
              ) : (
                <>
                  🏀 {player.name} ({player.position || "Sin posición"}) - Equipo:{" "}
                  {teams.find((t) => t.id === player.teamId)?.name || "Desconocido"}
                  <button onClick={() => startEditing(player)} style={{ marginLeft: '1rem' }}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(player.id)} style={{ marginLeft: '0.5rem' }}>
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

export default PlayersPage;
