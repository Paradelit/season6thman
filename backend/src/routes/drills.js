const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', async (req, res) => {
  const snapshot = await db.collection('drills').get();
  const drills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(drills);
});

router.post('/', async (req, res) => {
  const data = req.body;
  const ref = await db.collection('drills').add(data);
  res.status(201).json({ id: ref.id });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const doc = await db.collection('drills').doc(id).get();
  if (!doc.exists) {
    res.status(404).json({ message: 'Drill not found' });
  } else {
    res.json({ id: doc.id, ...doc.data() });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await db.collection('drills').doc(id).update(data);
    res.json({ message: 'Drill updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating drill', error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('drills').doc(id).delete();
  res.json({ message: 'Drill deleted successfully' });
});
module.exports = router;
