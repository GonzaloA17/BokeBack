const express = require("express");
const router = express.Router();
const users = require("./users.route.js");
const catalogo = require("./catalogoRoute.js");

router.use("/users", users);
router.use("/catalogo", catalogo);

module.exports = router;