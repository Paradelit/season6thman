import React, { useState } from 'react';

const AddTeamForm = ({ onTeamCreated }) => {
  const [name, setName] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(`✅ Equipo creado: ${data.name}`);
        setName('');
        if (onTeamCreated) onTeamCreated(); // Recargar equipos
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
      <h2>Crear Nuevo Equipo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Crear</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default AddTeamForm;
