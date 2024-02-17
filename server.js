require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index.route.js");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173/", // URL del frontend
    credentials: true, // Habilita el envio de cookies
  })
);
app.use("/api", routes);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});