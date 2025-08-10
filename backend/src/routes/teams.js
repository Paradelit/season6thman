const express = require("express");
const router = express.Router();
const { db } = require("../db"); 

// ✅ Crear un equipo
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nombre del equipo requerido" });

    const newTeamRef = db.collection("teams").doc();
    await newTeamRef.set({
      name,
      createdAt: new Date()
    });

    res.status(201).json({ id: newTeamRef.id, name });
  } catch (error) {
    console.error("❌ Error al crear equipo:", error);
    res.status(500).json({ error: "Error al crear equipo" });
  }
});

// ✅ Obtener todos los equipos
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("teams").orderBy("createdAt", "desc").get();

    const teams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(teams);
  } catch (error) {
    console.error("❌ Error al obtener equipos:", error);
    res.status(500).json({ error: "Error al obtener equipos" });
  }
});

// 🟡 Actualizar un equipo
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) return res.status(400).json({ error: "Nombre del equipo requerido" });

    const teamRef = db.collection("teams").doc(id);
    const doc = await teamRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    await teamRef.update({ name });
    res.status(200).json({ message: "Equipo actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar equipo:", error);
    res.status(500).json({ error: "Error al actualizar equipo" });
  }
});

// 🔴 Eliminar un equipo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const teamRef = db.collection("teams").doc(id);
    const doc = await teamRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    await teamRef.delete();
    res.status(200).json({ message: "Equipo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar equipo:", error);
    res.status(500).json({ error: "Error al eliminar equipo" });
  }
});

module.exports = router;
