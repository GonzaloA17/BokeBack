const express = require("express");
const CatalogoModel = require("../models/catalogo.js");
const db = require("../models/db.js");
const router = express.Router();

// Ruta para el registro del catalogo
router.post("/register/Catalogo", async (req, res) => {
  try {
    // Crea una instancia del modelo del catalogo
    const newCatalogo = new CatalogoModel(req.body.name, req.body.descripcion, req.body.image, req.body.categoria);

    // Guarda nueva prenda en la base de datos
    const newReturnedCatalogo=await newCatalogo.save();
    res.send(newReturnedCatalogo);
  } catch (error) {
    console.error("Error en la aplicación:", error);
  }
});

// Ruta para actualizar datos del producto
router.put("/update/:CatalogoId", async (req, res) => {
  try {
    const CatalogoId = req.params.CatalogoId;
    // Verifica si el producto existe
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

    if (req.body.descripcion) {
        existingCatalogo.descripcion = req.body.descripcion;
    }

    if (req.body.image) {
        existingCatalogo.image = req.body.image;
    }
    if (req.body.image) {
      existingCatalogo.categoria = req.body.categoria;
  }
    // Guarda los cambios en la base de datos
    await db.ref("Catalogo").child(CatalogoId).set(existingCatalogo);

    res.send("Catalogo actualizado correctamente.");
  } catch (error) {
    console.error("Error al actualizar el catalogo:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.delete("/delete/:CatalogoId", async (req, res) => {
  try {
    const CatalogoId = req.params.CatalogoId;
    // Verifica si el artículo existe
    const CatalogoSnapshot = await db.ref("Catalogo").child(CatalogoId).once("value");
    if (!CatalogoSnapshot.exists()) {
      res.status(404).send("Prenda no encontrada.");
      return;
    }
    // Elimina el artículo del catálogo
    await db.ref("Catalogo").child(CatalogoId).remove();

    res.send("Artículo eliminado del catálogo correctamente.");
  } catch (error) {
    console.error("Error al eliminar el artículo del catálogo:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;