const express = require("express");
const router = express.Router();
const registrationsController = require("../controllers/registrations.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/:eventId/register",authMiddleware.verifyToken, registrationsController.registerForEvent);
router.get("/:eventId/registrations", registrationsController.getEventAttendees);
router.delete("/:eventId/register", authMiddleware.verifyToken, registrationsController.cancelRegistration);


module.exports = router;