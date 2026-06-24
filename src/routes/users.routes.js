const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/", authMiddleware.verifyToken, usersController.getAllUsers);
router.get("/me", authMiddleware.verifyToken,usersController.getProfile);
router.get("/:id", usersController.getUserById);


module.exports = router