const express = require("express");
const router = express.Router();
const promosController = require("../controllers/promos.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware.verifyToken, promosController.getAllPromos);
router.post("/", authMiddleware.verifyToken, promosController.createPromo);
router.put("/:id", authMiddleware.verifyToken, promosController.updatePromo);
router.delete("/:id", authMiddleware.verifyToken, promosController.deletePromo);

module.exports = router;