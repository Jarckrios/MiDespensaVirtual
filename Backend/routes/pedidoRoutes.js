const express = require("express");
const router = express.Router();

const pedidoController = require("../controllers/pedidoController");

router.post("/confirmar", pedidoController.confirmarCompra);
router.get("/usuario/:id_usuario", pedidoController.obtenerPedidosUsuario);

module.exports = router;