const express = require("express");
const router = express.Router();
const promosController = require("../controllers/promos.controller");

router.get("/", promosController.getAllPromos);
router.post("/", promosController.createPromo);
module.exports = router;