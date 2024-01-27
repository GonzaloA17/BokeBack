const admin = require("firebase-admin");

// Configura la aplicación de administrador de Firebase con tus credenciales
var serviceAccount = require("../bokeback-2614b-firebase-adminsdk-pd4wu-050d7be3ba.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bokeback-2614b-default-rtdb.firebaseio.com/"
})

//Referencia a la base de datos
const db= admin.database();

module.exports =db;