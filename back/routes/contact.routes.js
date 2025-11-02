const express = require("express");
const { enviarMensaje } = require("../controllers/contact.controller");
const router = express.Router();

router.post("/contacto", enviarMensaje);

module.exports = router;
