const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware.verifyToken, eventsController.getAllEvents);
router.post("/", authMiddleware.verifyToken, authMiddleware.canManageEvents, eventsController.createEvent);
router.put("/:eventId", authMiddleware.verifyToken, authMiddleware.canManageEvents, eventsController.updateEvent);
router.delete("/:eventId", authMiddleware.verifyToken, authMiddleware.canManageEvents, eventsController.deleteEvent);

module.exports = router;