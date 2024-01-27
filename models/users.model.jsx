const db = require("../models/db.js");
const bcrypt = require("bcrypt");

// Define el modelo de usuario
/* Firebase Realtime Database es una base de datos NoSQL y, a diferencia de bases de datos SQL, 
no define un esquema fijo con tipos de datos, restricciones de clave única, etc. En Firebase, 
cada nodo puede contener diferentes tipos de datos y no hay una restricción de esquema estricto. */
class UserModel {
  constructor(name, email, password, isAdmin) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }

  async save() {
    try {
        // Generar un salt para la contraseña
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
  
        // Hash de la contraseña con el salt generado
        const hashedPassword = await bcrypt.hash(this.password, salt);
  
        // Almacenar la contraseña hasheada en lugar de la original
        this.password = hashedPassword;
  
      // Guardar el usuario en la base de datos
      const newRef = await db.ref("Users").push(this);

    // Obtener el ID asignado por Firebase
    const userId = newRef.key;

    // Asignar el ID al usuario
    this.id = userId;

    console.log("Usuario guardado con ID actualizado:", this);

    // Devuelve el usuario con el ID
    return this;
      } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  }

  static async authenticate(email, password) {
    try {
      // Obtener usuarios con el mismo correo electrónico
      const snapshot = await db.ref("Users").orderByChild("email").equalTo(email).once("value");

      // Verificar si existe un usuario con ese correo electrónico
      if (snapshot.exists()) {
        const users = snapshot.val();

        // Buscar el usuario y verificar la contraseña (usando bcrypt.compare)
        for (const userId in users) {
          const user = users[userId];
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            // Credenciales válidas, puedes devolver el usuario o solo un indicador de éxito
            const userRef = db.ref("Users").child(userId);
          
            const userRefUrl = userRef.toString();

            // Dividir la URL utilizando '/' como delimitador y obtener el último elemento
            const parts = userRefUrl.split('/');
            const refUser = parts[parts.length - 1];

            const userToReturn ={
                id:refUser,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin
            }

            return userToReturn;
          }
        }
      }

      // No se encontró un usuario con el correo electrónico proporcionado o las credenciales son incorrectas
      return null;
    } catch (error) {
      console.error("Error al autenticar el usuario:", error);
      throw error;
    }
  }
}

module.exports = UserModel;