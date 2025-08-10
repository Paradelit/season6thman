const express = require("express");
const router = express.Router();
const { db } = require("../db");

// Crear jugador
router.post("/", async (req, res) => {
  try {
    const { name, position, teamId } = req.body;
    if (!name || !teamId) {
      return res.status(400).json({ error: "Nombre y teamId son obligatorios" });
    }

    // Verificar que el equipo existe
    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();
    if (!teamDoc.exists) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    const newPlayerRef = db.collection("players").doc();
    await newPlayerRef.set({
      name,
      position: position || "",
      teamId,
      createdAt: new Date()
    });

    res.status(201).json({ id: newPlayerRef.id, name, position, teamId });
  } catch (error) {
    console.error("Error al crear jugador:", error);
    res.status(500).json({ error: "Error al crear jugador" });
  }
});

// Obtener todos los jugadores
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("players").orderBy("createdAt", "desc").get();
    const players = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(players);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});

// Obtener jugadores por equipo
router.get("/team/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const snapshot = await db.collection("players").where("teamId", "==", teamId).orderBy("createdAt", "desc").get();
    const players = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(players);
  } catch (error) {
    console.error("Error al obtener jugadores por equipo:", error);
    res.status(500).json({ error: "Error al obtener jugadores por equipo" });
  }
});

// Actualizar jugador
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, teamId } = req.body;
    if (!name || !teamId) {
      return res.status(400).json({ error: "Nombre y teamId son obligatorios" });
    }

    const playerRef = db.collection("players").doc(id);
    const playerDoc = await playerRef.get();
    if (!playerDoc.exists) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    // Opcional: verifica que el teamId es válido
    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();
    if (!teamDoc.exists) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    await playerRef.update({ name, position: position || "", teamId });
    res.status(200).json({ message: "Jugador actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar jugador:", error);
    res.status(500).json({ error: "Error al actualizar jugador" });
  }
});

// Eliminar jugador
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const playerRef = db.collection("players").doc(id);
    const playerDoc = await playerRef.get();
    if (!playerDoc.exists) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }
    await playerRef.delete();
    res.status(200).json({ message: "Jugador eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar jugador:", error);
    res.status(500).json({ error: "Error al eliminar jugador" });
  }
});

module.exports = router;
