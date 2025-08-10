const express = require('express');
const cors = require('cors');
const app = express();
const teamsRoutes = require('./routes/teams');
const playersRoutes = require('./routes/players');
const drillsRoutes = require('./routes/drills');
const workoutsRoutes = require('./routes/workouts');

app.use(cors({ origin: ['https://5173-firebase-season6thman-1754828668482.cluster-64pjnskmlbaxowh5lzq6i7v4ra.cloudworkstations.dev', 'https://9000-firebase-season6thman-1754828668482.cluster-64pjnskmlbaxowh5lzq6i7v4ra.cloudworkstations.dev'] }));
app.use(express.json());

app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/drills', drillsRoutes);
app.use('/api/workouts', workoutsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
