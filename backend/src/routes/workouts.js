const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', async (req, res) => {
  const snapshot = await db.collection('workouts').get();
  const workouts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(workouts);
});

router.post('/', async (req, res) => {
  const data = req.body;
  const ref = await db.collection('workouts').add(data);
  res.status(201).json({ id: ref.id });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const doc = await db.collection('workouts').doc(id).get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  res.json({ id: doc.id, ...doc.data() });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await db.collection('workouts').doc(id).update(data);
  res.json({ id });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('workouts').doc(id).delete();
  res.json({ message: 'Workout deleted successfully' });
});

module.exports = router;
