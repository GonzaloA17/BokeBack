const express = require("express");
const UserModel = require("../models/users.model.jsx");
const db = require("../models/db.js");
const bcrypt = require("bcrypt");
const router = express.Router();

// Ruta para el registro de usuario
router.post("/register", async (req, res) => {
  try {
    // Crea una instancia del modelo de usuario
    const newUser = new UserModel(req.body.name, req.body.email, req.body.password, req.body.isAdmin);

    // Guarda el usuario en la base de datos
    const newReturnedUser=await newUser.save();
    res.send(newReturnedUser);
  } catch (error) {
    console.error("Error en la aplicación:", error);
  }
});

// Ruta para el inicio de sesión de usuario
router.post("/login", async (req, res) => {
  try {
    // Aquí puedes implementar la lógica de inicio de sesión
    // Por ejemplo, verificar si las credenciales son válidas en la base de datos

    // Supongamos que tienes un método en UserModel para verificar las credenciales
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


// Ruta para actualizar datos del usuario
router.put("/update/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verifica si el usuario existe
    const userSnapshot = await db.ref("Users").child(userId).once("value");
    if (!userSnapshot.exists()) {
      res.status(404).send("Usuario no encontrado.");
      return;
    }

    const existingUser = userSnapshot.val();

    // Actualiza los campos deseados
    if (req.body.name) {
      existingUser.name = req.body.name;
    }

    if (req.body.email) {
      existingUser.email = req.body.email;
    }

    if (req.body.password) {
      // Genera un nuevo hash para la nueva contraseña
      const saltRounds = 10;
      const newSalt = await bcrypt.genSalt(saltRounds);
      const newHashedPassword = await bcrypt.hash(req.body.password, newSalt);
      existingUser.password = newHashedPassword;
    }

    if (req.body.isAdmin) {
      existingUser.isAdmin = req.body.isAdmin;
    }

    // Guarda los cambios en la base de datos
    await db.ref("Users").child(userId).set(existingUser);

    res.send("Usuario actualizado correctamente.");
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;