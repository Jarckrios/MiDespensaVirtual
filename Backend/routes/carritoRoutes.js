const express = require("express");
const router = express.Router();

const carritoController = require("../controllers/carritoController");

router.post("/agregar", carritoController.agregarAlCarrito);
router.put("/cantidad", carritoController.actualizarCantidad);
router.delete("/producto/:id_detalle", carritoController.eliminarProducto);
router.delete("/vaciar/:id_usuario", carritoController.vaciarCarrito);
router.get("/:id_usuario", carritoController.verCarrito);

module.exports = router;