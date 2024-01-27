const express = require("express");
const CatalogoModel = require("../models/catalogo.js");
const db = require("../models/db.js");
const router = express.Router();

// Ruta para el registro de usuario
router.post("/register/Catalogo", async (req, res) => {
  try {
    // Crea una instancia del modelo de usuario
    const newCatalogo = new CatalogoModel(req.body.name, req.body.precio, req.body.image);

    // Guarda el usuario en la base de datos
    const newReturnedCatalogo=await newCatalogo.save();
    res.send(newReturnedCatalogo);
  } catch (error) {
    console.error("Error en la aplicación:", error);
  }
});

// Ruta para actualizar datos del usuario
router.put("/update/:CatalogoId", async (req, res) => {
  try {
    const CatalogoId = req.params.CatalogoId;

    // Verifica si el usuario existe
    const CatalogoSnapshot = await db.ref("Catalogo").child(CatalogoId).once("value");
    if (!CatalogoSnapshot.exists()) {
      res.status(404).send("Prenda no encontrada.");
      return;
    }

    const existingCatalogo = CatalogoSnapshot.val();

    // Actualiza los campos deseados
    if (req.body.name) {
        existingCatalogo.name = req.body.name;
    }

    if (req.body.precio) {
        existingCatalogo.precio = req.body.precio;
    }

    if (req.body.image) {
        existingCatalogo.image = req.body.image;
    }

    // Guarda los cambios en la base de datos
    await db.ref("Catalogo").child(CatalogoId).set(existingCatalogo);

    res.send("Catalogo actualizado correctamente.");
  } catch (error) {
    console.error("Error al actualizar el catalogo:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;