const db = require("../models/db.js");

class CatalogoModel {
    constructor(name, precio, image) {
      this.name = name;
      this.precio = precio;
      this.image = image;
    }
  
    async save() {
      try {
        // Guardar el usuario en la base de datos
        const newRef = await db.ref("Catalogo").push(this);
  
      // Obtener el ID asignado por Firebase
      const catalogoId = newRef.key;
  
      // Asignar el ID al usuario
      this.id = catalogoId;
  
      console.log("Prenda guardada con ID actualizado:", this);
  
      // Devuelve el usuario con el ID
      return this;
        } catch (error) {
        console.error("Error al crear la prenda:", error);
      }
    }
  
 
  }
  
module.exports = CatalogoModel;