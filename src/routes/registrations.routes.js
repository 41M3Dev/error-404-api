const express = require("express");
const router = express.Router();
const registrationsController = require("../controllers/registrations.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/:eventId/register",authMiddleware.verifyToken, registrationsController.registerForEvent);




module.exports = router;