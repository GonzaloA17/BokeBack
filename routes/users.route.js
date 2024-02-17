const express = require("express");
const UserModel = require("../models/users.model.jsx");
const db = require("../models/db.js");
const bcrypt = require("bcrypt");
const router = express.Router();

// Ruta para el inicio de sesión de usuario
router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.authenticate(req.body.email, req.body.password);

    if (user) {
      res.send(user);
    } else {
      res.status(401).send("Credenciales incorrectas.");
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).send("Error interno del servidor");
  }
});




module.exports = router;