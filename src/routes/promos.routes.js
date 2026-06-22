const express = require("express");
const router = express.Router();
const promosController = require("../controllers/promos.controller");

router.get("/", promosController.getAllPromos);
router.post("/", promosController.createPromo);
router.put("/:id", promosController.updatePromo);
router.delete("/:id", promosController.deletePromo);

module.exports = router;