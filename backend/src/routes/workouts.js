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

module.exports = router;
