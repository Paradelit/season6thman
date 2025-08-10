import React, { useState, useEffect } from 'react';

const AddPlayerForm = ({ teams, onPlayerCreated }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [teamId, setTeamId] = useState('');
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (teams.length > 0) setTeamId(teams[0].id);
  }, [teams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, teamId }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(`✅ Jugador creado: ${data.name}`);
        setName('');
        setPosition('');
        if (onPlayerCreated) onPlayerCreated();
      } else {
        setResponse(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setResponse('❌ Error al conectar con el servidor');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Jugador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Posición (opcional)"
          value={position}
          onChange={e => setPosition(e.target.value)}
        />
        <select value={teamId} onChange={e => setTeamId(e.target.value)} required>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <button type="submit">Crear Jugador</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default AddPlayerForm;
